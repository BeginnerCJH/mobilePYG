$(function () {
  setApi();
 function setApi() {
   /* 存储公共的api */
   var baseUrl = "http://api.pyg.ak48.xyz/api/public/v1/";
   /* 发送请求前 调用 封装公共部分的接口api */
   $.ajaxSettings.beforeSend = function (xhr, obj) {
     obj.url = baseUrl + obj.url;

   }
   
 }

})
 