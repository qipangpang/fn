<template>
  <section class="loginContainer">
    <div class="loginInner">
      <div class="login_header">
        <h2 class="login_logo">硅谷外卖</h2>
        <div class="login_header_title">
          <a href="javascript:;" :class="{on:loginWay}" @click="loginWay=true">短信登录</a>
          <a href="javascript:;" :class="{on:!loginWay}" @click="loginWay=false">密码登录</a>
        </div>
      </div>
      <div class="login_content">
        <form>
          <div :class="{on:loginWay}">
            <section class="login_message">
              <input
                type="tel"
                maxlength="11"
                placeholder="手机号"
                v-model="phone"
                name="phone"
                v-validate="'required|phone'"
              />
              <span
                style="color:red"
                v-show="errors.has('phone')"
                class="help is-danger"
              >{{ errors.first('phone') }}</span>

              <button
                :disabled="!isRightPhone||computeTime>0"
                class="get_verification"
                :class="{right_number_phone:isRightPhone}"
                @click.prevent="sendCode"
              >{{computeTime>0?`已发送(${computeTime})s`:'获取验证码'}}</button>
            </section>
            <section class="login_verification">
              <input
                type="tel"
                maxlength="8"
                placeholder="验证码"
                name="code"
                v-model="code"
                v-validate="'required'"
              />
              <span
                style="color:red"
                v-show="errors.has('code')"
                class="help is-danger"
              >{{ errors.first('code') }}</span>
            </section>
            <section class="login_hint">
              温馨提示：未注册硅谷外卖帐号的手机号，登录时将自动注册，且代表已同意
              <a href="javascript:;">《用户服务协议》</a>
            </section>
          </div>
          <div :class="{on:!loginWay}">
            <section>
              <section class="login_message">
                <input
                  type="tel"
                  maxlength="11"
                  placeholder="手机/邮箱/用户名"
                  name="name"
                  v-model="name"
                  v-validate="'required'"
                />
                <span
                  style="color:red"
                  v-show="errors.has('name')"
                  class="help is-danger"
                >{{ errors.first('name') }}</span>
              </section>
              <section class="login_verification">
                <input
                  :type="isShowPwd?'text':'password'"
                  maxlength="8"
                  placeholder="密码"
                  name="pwd"
                  v-model="pwd"
                  v-validate="'required'"
                />
                <span
                  style="color:red"
                  v-show="errors.has('pwd')"
                  class="help is-danger"
                >{{ errors.first('pwd') }}</span>
                <div
                  class="switch_button"
                  :class="isShowPwd?'on':'off'"
                  @click="isShowPwd=!isShowPwd"
                >
                  <div class="switch_circle" :class="{right:isShowPwd}"></div>
                  <span class="switch_text">{{isShowPwd?'abc':'...'}}</span>
                </div>
              </section>
              <section class="login_message">
                <input
                  type="text"
                  maxlength="11"
                  placeholder="验证码"
                  name="captcha"
                  v-model="captcha"
                  v-validate="'required'"
                />
                <span
                  style="color:red"
                  v-show="errors.has('captcha')"
                  class="help is-danger"
                >{{ errors.first('captcha') }}</span>
                <img
                  class="get_verification"
                  ref="captcha"
                  src="http://localhost:5000/captcha"
                  alt="captcha"
                  @click="sendCaptcha"
                />
              </section>
            </section>
          </div>
          <button class="login_submit" @click.prevent="login">登录</button>
        </form>
        <a href="javascript:;" class="about_us">关于我们</a>
      </div>
      <a href="javascript:" class="go_back" @click="$router.back()">
        <i class="iconfont icon-jiantou2"></i>
      </a>
    </div>
  </section>
</template>
<script>
import {reqSendCode,reqSmsLogin,reqPwdLogin} from '../../api'
import {RECEIVE_USER} from '../../store/mutation-types.js'
export default {
  data() {
    return {
      loginWay: true, //true---默认值---手机号码的方式,false:用户名密码的方式
      phone: "", // 手机号码
      computeTime: 0, // 倒计时
      isShowPwd:false, //默认是不显示明文密码
      code:'', // 短信验证码
      name:'', // 用户名
      pwd:'', // 密码
      captcha: '' // 图形验证码

    };
  },
  // 计算属性
  computed: {
    //验证手机号是否正确,如果是正确的,那么对应的发送短信的按钮就可以启用
    isRightPhone() {
      return /^1\d{10}$/.test(this.phone);
    },
   
  },
  methods: {
    // 发送短信验证码
    async sendCode(){
      //倒计时操作
      this.computeTime=10
      this.timeId=setInterval(() => {
        this.computeTime--
        if(this.computeTime<0){
          this.computeTime=0
          clearInterval(this.timeId)
        }
      }, 1000);

      //发送验证码
      const result=await reqSendCode(this.phone)
      if(result.code===0){
          alert('发送成功')
      }else{
        this.computeTime=0
        clearInterval(this.timeId)
        //错误消息
        alert(result.msg)
      }

    },
    // 发送图形验证码
    sendCaptcha(){
      this.$refs.captcha.src="http://localhost:5000/captcha?time="+Date.now()
    },
    // 登录
    async login(){
      // 是手机方式还是用户名方式
      const {loginWay,phone,code,name,pwd,captcha}=this
      // 定义一个数组,用来存储验证的名字
      let names
      if(loginWay){
        //手机
        names=['phone','code']
      }else{
        //用户名
        names=['name','pwd','captcha']
      }
      //统一的验证,如果全部验证通过,则为true
      const success = await this.$validator.validateAll(names) // 对指定的所有表单项进行验证
      if(success){
        //登录
        let result
        //再次判断是什么方式登录-----涉及到提交用户信息的问题---保存用户信息---mutation---更改用户信息--用户用对象存储
        if(loginWay){
          //手机的方式登录
          result = await reqSmsLogin(phone,code)

        }else{
          //用户名的方式登录
           result = await reqPwdLogin({name,pwd,captcha})
        }

        //获取result.code
        if(result.code===0){

          //成功了
          const user=result.data
          //提交-----更改用户的信息//-------------------坑
          this.$store.commit(RECEIVE_USER,user)   //---作用---更新用户信息
          //保存用户信息-------
          //跳转----
          this.$router.replace('/profile')//----显示的用户信息
        }else{
          //错误消息
          alert(result.msg)
        }
      }
    }

    // 如果是手机登录,必须发送验证码
    // 如果是用户名和密码登录,还必须有图形验证码
  }
};
</script>
<style lang="stylus" rel="stylesheet/stylus" scoped>
@import '../../common/stylus/mixins.styl'
.loginContainer
  width 100%
  height 100%
  background #fff
  .loginInner
    padding-top 60px
    width 80%
    margin 0 auto
    .login_header
      .login_logo
        font-size 40px
        font-weight bold
        color #02a774
        text-align center
      .login_header_title
        padding-top 40px
        text-align center
        >a
          color #333
          font-size 14px
          padding-bottom 4px
          &:first-child
            margin-right 40px
          &.on
            color #02a774
            font-weight 700
            border-bottom 2px solid #02a774
    .login_content
      >form
        >div
          display none
          &.on
            display block
          input
            width 100%
            height 100%
            padding-left 10px
            box-sizing border-box
            border 1px solid #ddd
            border-radius 4px
            outline 0
            font 400 14px Arial
            &:focus
              border 1px solid #02a774
          .login_message
            position relative
            margin-top 16px
            height 48px
            font-size 14px
            background #fff
            .get_verification
              position absolute
              top 50%
              right 10px
              transform translateY(-50%)
              border 0
              color #ccc
              font-size 14px
              background transparent
              &.right_number_phone
                color black
          .login_verification
            position relative
            margin-top 16px
            height 48px
            font-size 14px
            background #fff
            .switch_button
              font-size 12px
              border 1px solid #ddd
              border-radius 8px
              transition background-color 0.3s, border-color 0.3s
              padding 0 6px
              width 30px
              height 16px
              line-height 16px
              color #fff
              position absolute
              top 50%
              right 10px
              transform translateY(-50%)
              &.off
                background #fff
                .switch_text
                  float right
                  color #ddd
              &.on
                background #02a774
              >.switch_circle
                // transform translateX(27px)
                position absolute
                top -1px
                left -1px
                width 16px
                height 16px
                border 1px solid #ddd
                border-radius 50%
                background #fff
                box-shadow 0 2px 4px 0 rgba(0, 0, 0, 0.1)
                transition transform 0.3s
                &.right
                  transform translateX(27px)
          .login_hint
            margin-top 12px
            color #999
            font-size 14px
            line-height 20px
            >a
              color #02a774
        .login_submit
          display block
          width 100%
          height 42px
          margin-top 30px
          border-radius 4px
          background #4cd96f
          color #fff
          text-align center
          font-size 16px
          line-height 42px
          border 0
      .about_us
        display block
        font-size 12px
        margin-top 20px
        text-align center
        color #999
    .go_back
      position absolute
      top 5px
      left 5px
      width 30px
      height 30px
      >.iconfont
        font-size 20px
        color #999
</style>