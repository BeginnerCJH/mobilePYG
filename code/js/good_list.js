$(function () {
  /* 准备发送请求的数据 */
  var requestGoodsData = {
    query: "",
    cid: utilsCode.parameter(location.search).cid,
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
    mui.init({
      pullRefresh: {
        container: ".pyg-views",
        down: {
          auto: true,
          //  触发下拉刷新时自动触发
          callback: function () {
            // 重置页码数为第一页
            requestGoodsData.pagenum=1;
            // 下拉刷新
            getGoods(function (htmlStr) {
            $(".good-list-main").html(htmlStr);
            // 结束下拉刷新
            mui('.pyg-views').pullRefresh().endPulldownToRefresh();
            // 在结束刷新之后  应重置上拉加载
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
          if(requestGoodsData.pagenum>=pageCount){
              // 没有更多数据 提示用户没有更多数据
            // 结束上拉加载更多 如果没有数据 传入 true 否则 传入 false
            mui('.pyg-views').pullRefresh().endPullupToRefresh(true);
            }else{
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
    eventList();
    
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
    // 给刷新按钮注册事件
    $(".fa-refresh").on("tap",function () {
      console.log('aaa');
      // 重置页码数为第一页
      requestGoodsData.pagenum = 1;
      // 下拉刷新
      getGoods(function (htmlStr) {
        $(".good-list-main").html(htmlStr);
        // 结束下拉刷新
        mui('.pyg-views').pullRefresh().endPulldownToRefresh();
        // 在结束刷新之后  应重置上拉加载
        // 重置 组件
        mui('.pyg-views').pullRefresh().refresh(true);
      });
      
    })

    // 为a链接注册事件
    $(".good-list-main").on("tap","a",function () {
      // 获取a标签中的href
      var href=this.href;
      location.href=href;
      
    });
  }

 

  
});