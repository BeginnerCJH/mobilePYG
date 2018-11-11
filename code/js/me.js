$(function () {
  init();
  function init() {
    // 开启登录验证 只有登录过得用户才可以访问
    if (!$.isLogin()) {
      // 未登录
      // 存储当前网页地址
      $.setPageUrl();
      // 立马跳转到登录界面
      location.href = "../pages/login.html";
    } else {
      // 已登录 显示购物车界面
      $("body").fadeIn();
    //  渲染用户信息
      userInfo();

    }
    eventList();
    
  }

  // 注册一大推事件
  function eventList() {
    // 登出
    $(".logout").on("tap",function () {
      // 清除绘画存储
      $.clearUserInfo();
      
      mui.confirm("确认退出？","温馨提示",["取消","确定"],function (mtype) {
        if(mtype.index==0){
          return;
        }else if(mtype.index==1){
          // 存储当前页面
          $.setPageUrl();
          // 跳转到登录页面
          location.href="../pages/login.html";
        }
      })
      
      
    })
    
  }

  // 请求用户信息 发送请求
  function userInfo() {
    $.get("my/users/userinfo",function (res) {
      if(res.meta.status==200){
        $(".user-name").text(res.data.username);
        $(".user-email").text(res.data.user_email);
      }
      
      
    })
    
  }
  
})