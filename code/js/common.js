$(function () {
  init();
  function init() {
    setApi();
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
    },

    // 存储用户登录信息 传入参数是对象
    setUserInfo: function (obj) {
      // 存储用户的信息 存储复杂信息之前要转换成字符串
      return sessionStorage.setItem("userInfo", JSON.stringify(obj));
    },

    // 判断用户使用是否登录
    isLogin: function () {
      // 获取之前存储的用户信息
      var userInfo = sessionStorage.getItem("userInfo");
      if (userInfo) {
        return true;
      } else {
        return false;
      }
    },

    // 获取存储的用户信息
    getUserInfo: function () {
      var userInfo = sessionStorage.getItem("userInfo");
      // 返回对象
      return JSON.parse(userInfo);

    },
    clearUserInfo:function () {
      // 删除绘画存储
      sessionStorage.removeItem("userInfo")  
    },

    // 存储当前网页的url
    setPageUrl: function () {
      // 存储当前的地址
      sessionStorage.setItem("pageUrl", location.href);
    },

    // 获取存储的网页地址
    getPageUrl: function () {
      return sessionStorage.getItem("pageUrl");
    },

    // 设置本地缓存的信息
    setLocalCache: function (typeName,categorydata) {
      /* 把请求回来的数据存储到本地缓存中 再存储本地存储的时间 */
      localStorage.setItem(typeName, JSON.stringify({
        time: Date.now(),
        data: categorydata
      })
      );
    },


    // 获取本地缓存的信息
    getLocalCache: function (typeName) {
      // 获取本地缓存的数据
      var cateDataStr = localStorage.getItem(typeName);
      return cateDataStr;
    }


  });
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
      // 设置公共地址
      obj.url = baseUrl + "api/public/v1/" + obj.url;
      // console.log(xhr,obj);
      // 判断是否是私有路径 只有是私有路径 才需要设置请求头的凭证
      if (obj.url.indexOf("/my/")!=-1){
        // 设置登录凭证的请求头，只能在原生的异步对象xhr中设置，不能在别人封装好的地方设置 否者不起效果
        // 原生的异步对象xhr中设置 键值对的方式
        xhr.setRequestHeader("Authorization", $.getUserInfo().token);
      }
      

      
      /*显示正在等待 */
      $("body").addClass("loadding");

    }

    $.ajaxSettings.complete = function () {
      /*隐藏正在等待 */
      $("body").removeClass("loadding");
    }

  }

  


})
