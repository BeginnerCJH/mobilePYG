$(function () {
  init();
  // 实例化
  function init() {
   
    getDetails();
  }
  
  // 轮播图
  function gdSlide() {
    //获得slider插件对象
    var gallery = mui('.mui-slider');
    gallery.slider({
      interval: 3000//自动轮播周期，若为0则不自动播放，默认为0；
    });
    
  }

  // 请求数据 向服务器发送请求
  function getDetails() {
    // console.log(utilsCode.parameter(location.search).goods_id);
    // 获取地址栏的参数
    var goods_id = utilsCode.parameter(location.search).goods_id;
    console.log(goods_id);
    
    $.get("goods/detail",{goods_id},function (res) {
        // console.log(res);
        if(res.meta.status==200){
          var htmlStr = template("gdetailTemp", { res: res.data});
          $(".pyg-views").html(htmlStr);

          // 调用轮播图
          gdSlide();
        }
        
    });
    
  }
  
  
});