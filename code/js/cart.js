$(function () {
  init();
  function init() {
    eventList();
    
  }
  // 注册一大堆事件
  function eventList() {
    // 立flag
    var flag=true;
    $("#btn-edit").on("tap",function () {
      if(flag){
        $("#btn-edit").text("完成");
        $("#btn-del").show();
        $(".goods-options").show();
        $(".mui-numbox").show();
      }else{
        $("#btn-edit").text("编辑");
        $("#btn-del").hide();
        $(".goods-options").hide();
        $(".mui-numbox").hide();
      }
      flag=!flag;
      
      
    });
    
  }
  
});