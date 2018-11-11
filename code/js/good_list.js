$(function () {
  /* 准备发送请求的数据 */
  var requestGoodsData = {
    query: localStorage.query || "",
    cid: localStorage.query? "" :$.getUrlParameter("cid"),
    pagenum: 1,//默认加载第一页数据
    pagesize: 10//页容器
  }
 
  /*定义一个全局变量  */
  var goodsData;
  // 定义一个全局变量 总页数  =总条数/页容器
  var pageCount=1; 
  
  init();
  /* 初始化 */
  function init() {
    // 
    refresh();
    eventList();
    
  }

  // 封装刷新数据
  function refresh() {
    mui.init({
      pullRefresh: {
        container: ".pyg-views",
        down: {
          auto: true,
          //  触发下拉刷新时自动触发
          callback: function () {
            // 重置页码数为第一页
            requestGoodsData.pagenum = 1;
            // 下拉刷新
            getGoods(function (htmlStr) {
              $(".good-list-main").html(htmlStr);
              // 结束下拉刷新
              mui('.pyg-views').pullRefresh().endPulldownToRefresh();
              // 在结束刷新之后   应重置上拉加载
              // 重置 组件
              mui('.pyg-views').pullRefresh().refresh(true);
            });
          }
        },
        up: {
          //  触发上拉刷新时自动触发
          callback: function () {
            //  上拉加载 
            // 判断是否还有下一页 如果没有提示用户没有更多数据
            // 如果还有下一页就 pagenum++
            if (requestGoodsData.pagenum >= pageCount) {
              // 没有更多数据 提示用户没有更多数据
              // 结束上拉加载更多 如果没有数据 传入 true 否则 传入 false
              mui('.pyg-views').pullRefresh().endPullupToRefresh(true);
            } else {
              // 页数++
              requestGoodsData.pagenum++;
              // 发送请求 向服务器请求数据
              getGoods(function (htmlStr) {
                // 加载更多是追加内容 而不是覆盖
                $(".good-list-main").append(htmlStr);
                // 结束上拉加载更多 如果没有数据 传入 true 否则 传入 false
                mui('.pyg-views').pullRefresh().endPullupToRefresh();

              });
            }
          }
        }
      }
    });
    
  }

  /* 调用商品列表详情-----传回调函数进行业务逻辑书写 */
  function getGoods(cb) {
    // console.log(utilsCode.parameter(location.search).cid);
    $.get("goods/search",requestGoodsData,function (res) {
      if(res.meta.status==200){
        goodsData=res.data;
        // 总页数=总条数/页容器的数量
        pageCount=Math.ceil(goodsData.total/requestGoodsData.pagesize);
        // console.log(pageCount);
        
        /* 调用模板方法 */
        var htmlStr = template("searchTemp", { res: goodsData.goods});
        // 上拉加载的时候，也要渲染页面,
        // 而且业务逻辑有点差异,上拉加载是追加内容 且是结束上拉加载
        //调用函数 并把传入模板参数
        cb(htmlStr);
      }
      
    })
  }

  function eventList() {
   
    // 为a链接注册事件
    $(".good-list-main").on("tap","a",function () {
      // 获取a标签中的href
      var href=this.href;
      location.href=href;
    });

    // 定义一个数组 存储用户输入的内容

    var searchArr = [];
    // 给搜索按框注册事件
    $("input[type='search']").on("focus",function () {
      // 进行一系列的骚操作
      $(".pyg-views").hide().prev().hide().siblings(".history").show().parents("body").css({ padding:"45px 0"});

      // 获取点击搜索存储到本地的信息
      var searchHistory = $.getLocalCache("search");
      if(!searchHistory){
        return;
      }else{
        
        var searchHistoryObj = JSON.parse(searchHistory).data;
        for (var i = 0; i < searchHistoryObj.length; i++) {
          var search = searchHistoryObj[i];
          // 再次判断 如果数组包含这个元素 中则不添加
          if (searchArr.indexOf(search)==-1){
            // 如果不存在后直接赋值
            searchArr.push(search);
          }
          
        }
        // 调用模板方法
        var htmlStr = template("historyTemp", { data: searchHistoryObj});
        $(".history").html(htmlStr);
        
      }
    
    });
   
    //给历史的a标签注册事件
    $(".history").on("click","a",function () {
      // 对应的文本
     var query= $(this).text();
      localStorage.query = query;
      location.reload();

     
     
      // debugger
      // 进行一系列的骚操作
      $(".pyg-views").show().prev().show().siblings(".history").hide().parents("body").css({ padding: "90px 0 45px 0" });


     
    }); 

    // 给搜索按钮注册事件
    $(".btn-search").on("tap",function () {
      // 进行一系列的骚操作
      $(".pyg-views").hide().prev().hide().siblings(".history").hide().siblings(".searchList").show().parents("body").css({ padding: "45px 0" });
      
      // 获取用户输入框的内容
      var searchStr = $("input[type='search']").val();
      // 判断  只存储历史记录中 输入框不存在的数据
      if (searchArr.indexOf(searchStr) == -1 && searchStr.length != 0){
        // 把用户输入的内容 存储到数组中
        searchArr.push(searchStr);
        $.setLocalCache("search", searchArr);
        // localStorage.searchArr = JSON.stringify(searchArr);
      }
      // 判断用户是否输入
      if (searchStr.length==0){
        return;
      }
      // 发送请求
      $.get("goods/qsearch",{ query: searchStr},function (res) {
          console.log(res);
          if(res.meta.status==200){
            // 调用模板方法
            var htmlStr = template("searchListTemp",{data:res.data});
            $(".ul-searchList").html(htmlStr);
          }else{
            mui.total(res.meta.msg);
          }
        
      })
     
      
      
      
    })

    // 获取footer 清除之前的存储查询条件
    $("footer").on("tap",function () {
      localStorage.query="";
      
    })
    // 清除之前的存储查询条件
    $(".good-list-main").on("tap","li",function () {
      localStorage.query = "";
      
    })
  }

 

  
});