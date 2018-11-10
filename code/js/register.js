$(function () {
  init();
  function init() {
    eventList();

  }
  // 注册一堆事件
  function eventList() {
    // 点击发送验证码
    $("#btn-code").on("tap", function () {
      // 发送验证码
      // 之前判断手机号是否合法输入
      // 获取手机号
      var mobile_txt = $("input[name='mobile']").val().trim();
      // 判断手机号是否合法 不合法直接return
      if (!$.checkPhone(mobile_txt)) {
        mui.toast("手机号格式错误");
        return;
      } else {
        // 手机号合法 发送请求验证码
        $.post("users/get_reg_code", { mobile: mobile_txt }, function (res) {
          console.log(res);
          // 请求数据成功后 禁止按钮
          if (res.meta.status == 200) {
            $("#btn-code").prop("disabled", true);
            var timer = 5;
            $("#btn-code").text(timer + "秒后重新发送");
            // 开启定时器 超时之后解开按钮并重新改变文本
            var timeId = setInterval(function () {
              timer--;
              $("#btn-code").text(timer + "秒后重新发送");
              if (timer == 0) {
                clearInterval(timeId);
                $("#btn-code").prop("disabled", false);
                $("#btn-code").text("获取验证码");
                // 把验证码获取到输入框中
                $("input[name=code]").val(res.data);
              }

            }, 1000)
          }

        })
      }


    });

    //点击注册
    $("#btn-register").on("tap", function () {
      // 注册之前先获取表单的内容
      var mobile_txt = $("input[name='mobile']").val().trim();
      var code_txt = $("input[name='code']").val().trim();
      var email_txt = $("input[name='email']").val().trim();
      var pwd_txt = $("input[name='pwd']").val().trim();
      var pwd2_txt = $("input[name='pwd2']").val().trim();
      var gender_txt = $("input[name='gender']:checked").val();

      // 逐个验证
      if (!$.checkPhone(mobile_txt)) {
        mui.toast("手机号格式错误");
        console.log('手机号格式错误');
        return;
      }

      // 验证 验证码的长度
      if (code_txt.length != 4) {
        mui.toast("验证码格式错误");
        console.log("验证码格式错误");
        return;
      }
      // 验证邮箱
      if (!$.checkEmail(email_txt)) {
        mui.toast("邮箱格式错误");
        console.log("邮箱格式错误");

        return;
      }

      // 验证密码
      if (pwd_txt.length < 6 || pwd_txt.length > 18) {
        mui.toast("密码格式错误");
        console.log("密码格式错误");
        return;
      }

      // 验证二次密码
      if (pwd_txt != pwd2_txt) {
        mui.toast("两次密码不一致");
        console.log("两次密码不一致");
        return;
      }

      // 验证都无误之后 发送请求 
      // 准备请求数据
      var regUserData = {
        mobile: mobile_txt,
        code: code_txt,
        email: email_txt,
        pwd: pwd_txt,
        pwd2: pwd2_txt,
        gender: gender_txt
      }
      // 发送请求
      $.post("users/reg",regUserData,function (res) {
        if(res.meta.status==200){
          // 提示用户注册成功
          mui.toast(res.meta.msg);
          // 跳转登录页面
          setTimeout(function () {    
            location.href="../pages/login.html"
          },2000)
        }else{
          // 提示用户注册失败信息
          mui.toast(res.meta.msg);
          console.log(res.meta.msg);
        }
        
        
      });


    });

  }

})