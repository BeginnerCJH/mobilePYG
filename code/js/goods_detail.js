$(function () {
  // 定义一个全局变量存储服务器返回的数据
  var detailData;
  init();
  // 实例化
  function init() {

    getDetails();
    eventList();
  }

  // 轮播图
  function gdSlide() {
    //获得slider插件对象
    var gallery = mui('.mui-slider');
    gallery.slider({
      interval: 3000//自动轮播周期，若为0则不自动播放，默认为0；
    });

  }

  // 请求数据 向服务器发送请求
  function getDetails() {
    // 获取地址栏的参数
    $.get("goods/detail", { goods_id: $.getUrlParameter("goods_id") }, function (res) {
      // console.log(res);
      if (res.meta.status == 200) {
        // 请求后的数据赋值给全局变量
        detailData = res.data
        var htmlStr = template("gdetailTemp", { res: detailData });
        $(".pyg-views").html(htmlStr);

        // 调用轮播图
        gdSlide();
      }

    });

  }

  // 注册一大堆事件
  function eventList() {
    $("#add-cart").on("tap", function () {
      // 点击加入购物车 判断用户是否已经登录
      // 获取之前存储的用户信息
      var userInfo = sessionStorage.getItem("userInfo")
      // 判断是否登录 如果没有登录
      if (!userInfo){
        // 存储当前的地址
        sessionStorage.setItem("detailUrl", location.href);
        // 提示用户重新登录
        mui.toast("请重新登录");
        // 两秒后跳转登录界面
        setTimeout(function () {
          location.href = "../pages/login.html";
        }, 2000);
      }else{
        // console.log('已经登录，可以为所欲为了');
        // 准备加入购物车的数据

        var addCartData={
          cat_id: detailData.cat_id,
          goods_id:detailData.goods_id,
          goods_name:detailData.goods_name,
          goods_number:detailData.goods_number,
          goods_price:detailData.goods_price,
          goods_small_logo:detailData.goods_small_logo,
          goods_weight:detailData.goods_weight
        }
        // 获取存储用户信息中token 也就是登录凭证 
        // 先把json字符串转成对象
        var token = JSON.parse(sessionStorage.getItem("userInfo")).token;
        // 把对象转换成json字符串
        var addCartDataStr=JSON.stringify(addCartData)
        // 发送请求 只能用ajax请求 因为登录认证的模式是才有jwt
        // 在访问有限的路径必须把token放在http的头
        $.ajax({
          url:"my/cart/add",
          type:"post",
          data:{
            info: addCartDataStr
          },
          dataType:"json",
          headers:{
            Authorization:token
          },
          success:function (res) {
            // console.log(res);
            if(res.meta.status==200){
              // 加入购物车成功，询问用户是否跳转购物车
              mui.confirm(
                "添加成功，是否跳转到购物车？",
                "温馨提示",
                ["取消","跳转"],
                function (aa) {
                  console.log(aa);
                  if (aa.index==0){
                    // 取消之后啥也不做
                  console.log('我就静静的不出声');
                  return;
                  }
                  if (aa.index==1){
                    // 跳转到购物车页面
                    location.href="../pages/cart.html"
                  }
                }

              );
            }else{
              // 提示用户失败信息
              mui.toast(res.meta.msg)
            }
            
            
          }

        });
        
      }
      
    });

  }


});