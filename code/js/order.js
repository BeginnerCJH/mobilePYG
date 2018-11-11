$(function () {
  init();
  function init() {
    // 开启验证
    if(!$.isLogin()){
      // 没有登录
      // 存储当前的地址
      $.setPageUrl();
      // 跳转登录界面
      location.href="../pages/login.html";
    }else{
      // 显示界面
      $("body").fadeIn();
      // 发送请求渲染页面
      $.get("my/orders/all", { type: 1 },function (res) {
        if(res.meta.status==200){
          // 调用模板方法
          var htmlStr=template("orderDelTemp",{data:res.data});
          $(".ul-order-del").html(htmlStr);
        }else{
          mui.toast(res.meta.msg)
        }
        
        
      });
    }
    
  }

  
});