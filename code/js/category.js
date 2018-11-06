$(function () {
  init();
   /* 定义一个全局变量存储请求回来的数据 */
   var categoryData;
   /* 定义全局变量存储实例化的左边滚动插件 */
  var leftScroll;
  function init() {
  /* 默认页面渲染数据 */
    getCategories();
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

  /* 请求分类数据 */
  function getCategories() {
    $.get("categories",function (res) {
      /* 把数据存储到全局变量中 */
      categoryData =res.data;
      // console.log(res);
      if (res.meta.status==200){
        // 调用模板方法---左边菜单栏
        var htmlStr = template("categoryLeftTemp", { res: categoryData});
        $(".category_menu").html(htmlStr);
        /* 实例化左边滚动条插件 */
        leftScroll = new IScroll('.category-left');
        /* 渲染右边内容的数据 */
        rightRender(0);
      }
      
    })
    
  }

  /* 渲染右边内容的数据 */
  function rightRender(index) {
    var htmlStr2 = template("categoryRightTemp", { res: categoryData[index].children});
    $(".category-right").html(htmlStr2);
  }
  
  
})