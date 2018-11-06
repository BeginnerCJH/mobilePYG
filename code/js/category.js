$(function () {
  init();
   /* 定义一个全局变量存储请求回来的数据 */
   var categoryData;
   /* 定义全局变量存储实例化的左边滚动插件 */
  var leftScroll;
  function init() {
  /* 默认页面渲染数据 */
    // getCategories();
    catesRender();
    setScrren();
    /* 注册事件的调用 */
    eventList();
   
  }
  /* 屏幕适配 */
  function setScrren() {
    var baseVal = 100;
    var scrrenWidth = 360;
    var currentScrren = document.querySelector("html").offsetWidth;
    var fs = baseVal * currentScrren / scrrenWidth;
    document.querySelector("html").style.fontSize = fs + "px";
  }
  window.onresize = function () {
    setScrren();
  }
  // 事件注册
  function eventList() {
    // 左边菜单注册滚动事件
    $(".category_menu").on("tap", "li",function (e) {
      /* 点击激活 */
      $(this).addClass("active").siblings().removeClass("active");
      /*点击对应菜单回滚到顶部  */
      leftScroll.scrollToElement(this);
      // 获取index值
      var index=$(this).index();
      console.log(index);
      
      /* 切换渲染右边内容的数据 */
      rightRender(index);

    });
    
  }
  /* 渲染页面的数据  一种是直接请求服务器 另一种是从本地缓存中找 */
  // 如果有本地缓存 再判断是否过期
  function catesRender() {
    // 获取本地缓存的数据
    var cateDataStr=localStorage.getItem("cates");
    // 判断是否存在本地缓存---不存在--直接到服务器请求数据
    if (!cateDataStr){
      getCategories();
    }else{
      // 数据存在后 把数据转为对象
      var cateDataObj = JSON.parse(cateDataStr);
      console.log(cateDataObj);
      
      // 判断时间是否过期 10s
      if (Date.now() - cateDataObj.time>10000){
        getCategories();
      }else{
        categoryData = cateDataObj.data;
        leftRender();
        rightRender(0);
      }
    }
    
  }

  /* 请求分类数据 */
  function getCategories() {
    $.get("categories",function (res) {
     
      // console.log(res);
      if (res.meta.status==200){
        /* 把数据存储到全局变量中 */
        categoryData = res.data;
        /* 把请求回来的数据存储到本地缓存中 再存储本地存储的时间 */
        localStorage.setItem("cates", JSON.stringify({ 
          time: Date.now(), 
          data: categoryData
        })
        );
        /* 渲染左边内容的数据 */
        leftRender();
        /* 渲染右边内容的数据 */
        rightRender(0);
      }
      
    })
    
  }
  /* 渲染左边内容的数据 */
  function leftRender() {
    // 调用模板方法---左边菜单栏
    var htmlStr = template("categoryLeftTemp", { res: categoryData });
    $(".category_menu").html(htmlStr);
    /* 实例化左边滚动条插件 */
    leftScroll = new IScroll('.category-left');
  }
  /* 渲染右边内容的数据 */
  function rightRender(index) {
    var htmlStr2 = template("categoryRightTemp", { res: categoryData[index].children});
    $(".rigth-content").html(htmlStr2);
    
    // 标签回来之后不一定有高度 等最后一张图片加载完成即可
    var num = $(".rigth-content img").length;
    $(".rigth-content img").on("load",function () {
      num--;
      // 最后一张图片加载完成后 实例插件
      if(num==0){
        var rightScroll = new IScroll(".category-right");
        // $("body").removeClass("loadding");
        
      }
    });
    
  }
  
  
})