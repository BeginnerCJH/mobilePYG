$(function () {
  init();
  function init() {
    setApi();
    waiting();
    
  }
  /* 存储公共的api */
 function setApi() {
   /* 存储公共的api */
   var baseUrl = "http://api.pyg.ak48.xyz/api/public/v1/";
   /* 发送请求前 调用 封装公共部分的接口api */
   $.ajaxSettings.beforeSend = function (xhr, obj) {
     obj.url = baseUrl + obj.url;

   }
   
 }
 /* 正在等待 */
  function waiting() {
    //当页面加载状态改变的时候执行这个方法
    document.onreadystatechange=function () {
      //当页面加载状态为完全结束时进入
      if (document.readyState =="complete"){
        //当页面加载完成后将loading页隐藏
        // $("body").removeClass("loadding");  
      }
      
    }
  //  window.onload=function () {
  //    
  //  }
    
 }

})
 