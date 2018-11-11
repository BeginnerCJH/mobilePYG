$(function () {
  init();
  function init() {
    eventList();
  }
  // 注册一堆事件
  function eventList() {
    $("#btn-login").on("tap",function () {
      // 登录前 先验证账号跟密码格式
      // console.log('aaa');
      // 先获取输入框的内容
      var mobile_txt = $("input[name='mobile']").val().trim();
      var pwd_txt = $("input[name='pwd']").val().trim();
      // 验证手机号是否正确和密码
      // 逐个验证
      if (!$.checkPhone(mobile_txt)) {
        mui.toast("手机号格式错误");
        console.log('手机号格式错误');
        return;
      }

      // 验证密码
      if (pwd_txt.length < 6 || pwd_txt.length > 18) {
        mui.toast("密码格式错误");
        console.log("密码格式错误");
        return;
      }

      // 验证成功后发送请求 
      // 准备数据
      var loginData={
        username: mobile_txt,
        password: pwd_txt
      }
      // 发送请求
      $.post("login",loginData,function (res) {
        if(res.meta.status==200){
          // 存储用户的信息 存储复杂信息之前要转换成字符串
          $.setUserInfo(res.data);
            // 提示用户登录成功
          mui.toast(res.meta.msg);
          // 跳转页面 判断如果是其他页跳转过来的 直接跳回之前页面，如果没有就跳转主页
          // var currentUrl = sessionStorage.getItem("detailUrl");
          var currentUrl = $.getPageUrl();
          if (!currentUrl){
            // 如果不存在  返回主页
            currentUrl ="../ index.html";
          }
          setTimeout(function () {
            location.href = currentUrl;
          },1000);
        }else{
          // 提示用户登录失败
          mui.toast(res.meta.msg);
        }
        
        
      });
      
      
      
    })
    
  }
  
})