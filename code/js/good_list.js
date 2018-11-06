$(function () {
  /*定义一个全局变量  */
  var goodData;
  init();
  /* 初始化 */
  function init() {
    getSearch();
  }
  /* 调用商品列表详情 */
  function getSearch() {
    $.get("goods/search",function (res) {
      if(res.meta.status==200){
        
        goodData=res.data;
        /* 调用模板方法 */
        var htmlStr = template("searchTemp", { res: goodData.goods});
        $(".good-list-main").html(htmlStr)
      }
      
    })
  }

 

  
});