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
      // 调用函数
      queryCartAll();

    }
    // 调用
    eventList();

  }
  // 注册一大堆事件
  function eventList() {
    // 注册按钮改变商品数量时时改变商品总价
    $(".ul-details").on("tap", ".mui-numbox .mui-btn", function () {
      // 点击按钮的时候再次调用计算总价的方法
      orderCount();

    });

    // 点击编辑
    $("#btn-edit").on("tap", function () {
      $("body").toggleClass("edit-cart");
      // 判断是否有这个类 来改变文本
      if ($("body").hasClass("edit-cart")) {
        $(this).text("完成");
      } else {
        $(this).text("编辑");
        // 先获取每个订单li
        var $lis = $(".ul-details li");
        // console.log('aaa');
        // 判断是否存在数据---订单是否存在
        if ($lis.length == 0) {
          mui.toast("亲，你还未购物，赶紧去淘你喜欢的吧");
          return;
        }
        // 有订单数据存在
        syncCartOrder($lis);



      }





    });

    // 点击删除
    $("#btn-del").on("tap", function () {
      // 1先 ---获取被选中的商品
      var $pitchOnlis = $(".ul-details").find("input[name='checkbox']:checked").parents("li");//注意 要获取上一级的上一级父元素必须要用parents()
      // 2判断是否选中商品
      if ($pitchOnlis.length == 0) {
        mui.toast("你还没有选择商品喔，请选择商品后再进行操作");
        return;
      }
      // 已经选择订单商品
      mui.confirm("是否确定删除选中订单商品","警告",["取消","确定"],function (mtype) {
        if(mtype.index=0){
          return;
        }else if(mtype.index=1){
          // 获取未选中的商品
          // 未选中的订单列表发送请求同步购物车数据=删除
          var $unpitchOnlis = $(".ul-details").find("input[name='checkbox']").not(":checked").parents("li");
          // 执行删除逻辑
          syncCartOrder($unpitchOnlis)
        }
      })

    })

    // 点击创建订单
    $(".order-content").on("tap",function () {
      // 获取每个订单li
      var $lis = $(".ul-details li");
      // console.log('生成订单');
      // 0先判断是否有订单商品数据
      if ($lis.length==0){
        mui.toast("亲，你的购物车还没有东西喔，赶快去购买心仪的商品吧");
        return;
      }
      // 准备生成订单的数据 发送到后台创建订单
      // 商品列表内部存放商品（ID，amount和goods_price）列表
      var orderData = {
        "order_price": $(".total-price").text(),
        "consignee_addr": $(".con-detail").text().trim(),
        "goods": []
      }
      
      // 遍历 
      for (var i = 0; i < $lis.length; i++) {
         // 获取每个订单li
          var li = $lis[i];
          // 获取每个订单li中的对象
          var goods_obj=$(li).data("obj");
          // 获取对象中的商品信息
          var goods={
            goods_id: goods_obj.goods_id,
            goods_number: goods_obj.amount,
            goods_price: goods_obj.goods_price
          }
          // 把获取到的商品信息存储到订单中
        orderData.goods.push(goods);
        
      }
      // 发送请求 创建订单
      $.post("my/orders/create",orderData,function (res) {
          // console.log(res);
          if(res.meta.status==200){
            
            mui.toast(res.meta.msg)
            // 跳转到订单页面
            setTimeout(function () {
              location.href="../pages/order.html";    
            },1000);

          }else{
            mui.toast(res.meta.msg)
          }
          
      })
      

      
      
      
    })

  }

  // 发送请求 查询购物车数据
  function queryCartAll() {
    // 向服务器发送请求
    $.get("my/cart/all", function (res) {
      console.log(res);
      if (res.meta.status == 200) {
        var cart_info = res.data.cart_info;
        // 判断返回的数据是否为空
        if (cart_info) {
          var cart_info_obj = JSON.parse(cart_info);
          console.log(cart_info_obj);
          // 调用模板方法
          var htmlStr = template("orderListTemp", { data: cart_info_obj })
          $(".ul-details").html(htmlStr);
          // 动态初始化数据 需要手动初始化组件
          mui(".mui-numbox").numbox();

          // 调用计算订单价格函数
          orderCount();
        }

      }

    })

  }

  // 计算订单总价
  function orderCount() {
    // 每个订单的单价*数量 每个订单相加
    // 1先获取每个订单li
    var $lis = $(".ul-details li");
    // console.log($lis);
    // 定义一个变量存储订单的踪迹
    var total_price = 0;
    // 2获取每个订单li中obj的对象 遍历
    for (var i = 0; i < $lis.length; i++) {
      var li = $lis[i]; //获取每个li对象
      // console.log(li);
      // 获取每个订单中的obj对象
      var goods_obj = $(li).data("obj");
      // console.log(goods_obj);
      // 获取订单的单价
      var order_price = goods_obj.goods_price;
      // console.log(order_price);
      // 获取数字输入框中的的数量
      var goods_num = $(li).find(".mui-input-numbox").val();
      // console.log(goods_num);
      total_price += order_price * goods_num;
    }
    // 赋值给总价
    $(".total-price").text(total_price);

  }

  // 封装同步购物车的代码
  /**
   * 
   * @param {ele} lis 订单对象
   */
  function syncCartOrder(lis) {
    // 订单存在
    // 定义一个对象存储发送请求的数据
    var infos = {};
    // 同步数据到后台，把改变的商品数量传递给后台
    for (var i = 0; i < lis.length; i++) {
      // 得到每个订单li
      var li = lis[i];
      // 获取每个订单li中的对象obj
      var goods_obj = $(li).data("obj");
      // 把当前的数量赋值给后台数据的商品数量
      goods_obj.amount = $(li).find(".mui-input-numbox").val();
      //  把数据存储到要发送的数据中
      infos[goods_obj.goods_id] = goods_obj;
    }
    // 发送同步购物车的请求
    $.post("my/cart/sync", { infos: JSON.stringify(infos) }, function (res) {
      // console.log(res);
      if (res.meta.status) {
        // 刷新页面
        queryCartAll();
      } else {
        mui.toast(res.meta.msg)
      }


    });
  }

});