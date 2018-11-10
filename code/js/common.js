$(function () {
  init();
  function init() {
    setApi();

  }
  /* 存储公共的api */
  function setApi() {
    /* 存储公共的api */
    var baseUrl = "http://api.pyg.ak48.xyz/";
    //  使用用模板变量 模板变量
    //  template.defaults.imports
    //  模板通过 $imports 可以访问到模板外部的全局变量与导入的变量。
    // 判断是否导入模板库
    if (window.template) {
      template.defaults.imports.imgUrl = baseUrl;
    }
    /* 发送请求前 调用 封装公共部分的接口api */
    $.ajaxSettings.beforeSend = function (xhr, obj) {
      obj.url = baseUrl + "api/public/v1/" + obj.url;

      /*显示正在等待 */
      $("body").addClass("loadding");

    }

    $.ajaxSettings.complete = function () {
      /*隐藏正在等待 */
      $("body").removeClass("loadding");
    }

  }

  //  扩展zepto
  $.extend($, {
    // 获取地址栏参数
    getUrlParameter: function (name) {
      var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
      var r = window.location.search.substr(1).match(reg);
      if (r != null) return decodeURI(r[2]);
      return null;
    },
    // 验证手机号码是否合法
    checkPhone: function (phone) {
      if (!(/^1[34578]\d{9}$/.test(phone))) {
        return false;
      } else {
        return true;
      }
    },

    // 验证邮箱是否合法
    checkEmail: function (myemail) {
      var myReg = /^[a-zA-Z0-9_-]+@([a-zA-Z0-9]+\.)+(com|cn|net|org)$/;
      if (myReg.test(myemail)) {
        return true;
      } else {
        return false;
      }
    }


  });


})
