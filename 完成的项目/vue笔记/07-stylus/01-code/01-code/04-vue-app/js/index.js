window.onload = function () {

  // 获取所有的footerItem
  var footerItems = document.querySelectorAll('.app .footer .footerItem')
  // 获取content中所有的section
  var sections = document.querySelectorAll('.app .content section')

  for (var i = 0; i < footerItems.length; i++) {
    var item = footerItems[i];
      (function (i) {
        // 绑定事件
        item.addEventListener('touchend', function () {
          // 再次循环
          for (var j = 0; j < footerItems.length; j++) {
            footerItems[j].className = "footerItem"
            sections[j].className = ""
          }
          // 设置当前点击的footerItem设置样式
          this.className = "footerItem active"
          sections[i].className = "on"
        }, false)
      })(i)
  }



  // for (var i = 0; i < footerItems.length; i++) {
  //   var item = footerItems[i]
  //   item.index=i
  //   // 绑定事件
  //   item.addEventListener('touchend', function () {
  //     // 再次循环
  //     for (var j = 0; j < footerItems.length; j++) {
  //       footerItems[j].className = "footerItem"
  //       sections[j].className = ""
  //     }
  //     // 设置当前点击的footerItem设置样式
  //     this.className="footerItem active"
  //     sections[this.index].className = "on"
  //   }, false)
  // }



  // 循环遍历所有的footerItem
  // for (let i = 0; i < footerItems.length; i++) {
  //   var item = footerItems[i]
  //   // 绑定事件
  //   item.addEventListener('touchend', function () {
  //     // 再次循环
  //     for (var j = 0; j < footerItems.length; j++) {
  //       footerItems[j].className = "footerItem"
  //       sections[j].className = ""
  //     }
  //     // 设置当前点击的footerItem设置样式
  //     this.className="footerItem active"
  //     sections[i].className = "on"
  //   }, false)
  // }





  new Swiper('.swiper-container', {
    // 间隔时间
    spaceBetween: 30,
    // 轮播
    centeredSlides: true,
    // autoplay: {
    //   delay: 2500,
    //   disableOnInteraction: true,
    // },
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
    loop: true
  });

}