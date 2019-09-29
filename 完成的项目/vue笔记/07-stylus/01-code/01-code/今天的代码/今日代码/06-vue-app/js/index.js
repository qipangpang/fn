window.onload = function () {

  // 切换样式的操作
  // 获取所有的footItem,添加点击事件,切换section的样式
  // 获取所有的footItem
  var footItem = document.querySelectorAll('.app .footer .footItem')
  // 获取所有的section
  var sections = document.querySelectorAll('.app .content section')
  // 遍历所有的footItem

  // 闭包
  for (let i = 0; i < footItem.length; i++) {
    (function (i) {
      // 每个添加事件
      var items = footItem[i]

      items.addEventListener('touchend', function () {
        for (var j = 0; j < footItem.length; j++) {
          footItem[j].className = "footItem"
          sections[j].className = ""
        }
        // 设置当前的footItem的类样式
        this.className = "footItem active"
        sections[i].className = "on"
      }, false)
    })(i)
  }

  // 自定义属性存值
  // for(let i=0;i<footItem.length;i++){
  //   // 每个添加事件
  //   var items=footItem[i]
  //   items.index=i
  //   items.addEventListener('touchend',function(){
  //     for(var j=0;j<footItem.length;j++){
  //       footItem[j].className="footItem"
  //       sections[j].className=""
  //     }
  //     // 设置当前的footItem的类样式
  //     this.className="footItem active"
  //     sections[this.index].className="on"
  //   },false)
  // }



  // for(let i=0;i<footItem.length;i++){
  //   // 每个添加事件
  //   var items=footItem[i]
  //   items.addEventListener('touchend',function(){
  //     for(var j=0;j<footItem.length;j++){
  //       footItem[j].className="footItem"
  //       sections[j].className=""
  //     }
  //     // 设置当前的footItem的类样式
  //     this.className="footItem active"
  //     sections[i].className="on"
  //   },false)
  // }


  new Swiper('.swiper-container', {
    // 间隔的描述
    spaceBetween: 30,
    // 
    centeredSlides: true,
    // 自动轮播
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