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
   template.defaults.imports.imgUrl = baseUrl;
   /* 发送请求前 调用 封装公共部分的接口api */
   $.ajaxSettings.beforeSend = function (xhr, obj) {
     obj.url = baseUrl + "api/public/v1/"+obj.url;

     /*显示正在等待 */
     $("body").addClass("loadding");

   }

   $.ajaxSettings.complete = function () {
      /*隐藏正在等待 */
     $("body").removeClass("loadding");
   }
   
 }


})
 