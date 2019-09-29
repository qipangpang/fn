/*
自定义PubSub
 */
(function (window) {
  // 总控制器对象
  const PubSub = {}
  // 用来保存所有消息的订阅者的容器对象
  let messages = {}  // {msg1: {token1: subscriber1, toten2: subscriber2}, msg2: {toten3: subscriber3}}
  // 用来存储消息的标识数据的变量
  let lastUid = 0

  /*
  订阅消息
  msg: 消息名
  subscriber: 处理消息的回调函数, 也称为订阅者
   */
  PubSub.subscribe = function (msg, subscriber) {
    // 如果当前消息的subscribers容器还没创建, 创建一个
    if (!messages.hasOwnProperty(msg)) {
      messages[msg] = {}
    }
    // 为当前消息生成一个唯一标识
    const token = 'uid-' + (++lastUid)
    // 保存订阅者回调函数
    messages[msg][token] = subscriber
    // 返回消息的标识token
    return token
  }

  /*
  异步发布消息(也就是订阅者回调函数是异步处理的)
  msg: 消息名
  data: 需要传递的数据, 会传递给所有匹配的订阅者回调函数
   */
  PubSub.publish = function (msg, data) {
    // 如果存在此消息的订阅器
    if (messages.hasOwnProperty(msg)) {
      // 得到消息对应的所有订阅器的容器
      const subscribers = messages[msg]
      // 异步调用所有订阅器回调函数
      setTimeout(() => {
        Object.values(subscribers).forEach(subscriber => subscriber(data))
      })
    }
  }

  /*
  同步发布消息(也就是订阅者回调函数是同步处理的)
  msg: 消息名
  data: 需要传递的数据, 会传递给所有匹配的订阅者回调函数
   */
  PubSub.publishSync = function (msg, data) {
    // 如果存在此消息的订阅器
    if (messages.hasOwnProperty(msg)) {
      // 得到消息对应的所有订阅器的容器
      const subscribers = messages[msg]
      // 同步调用所有订阅器回调函数
      Object.values(subscribers).forEach(subscriber => subscriber(data))
    }
  }

  /*
  取消消息订阅
   */
  PubSub.unsubscribe = function (flag) {

  }

  window.PubSub = PubSub
})(window)
