<template>
  <div class="create">
    <form class='box' @submit='checkMail'>
      <input class="mail" name="mail" type='text' :value="mail" focus v-model="mail" :disabled="CanNotChange"  placeholder="请输入邮箱..."  maxlength="32" @input="inputTyping">
      <input class="verification-text" name="verification" type="number" :value="verification"  placeholder="验证码" maxlength="6" >
      <button class="verification-btn" :class="{'nockick':!isClick}" @tap="isClick && newEmail()">{{time}}</button>
      <button class="btn" :class="{'long-btn':!alreadySet,'change-bg':!isChange}" :disabled="!isChange" form-type="submit">验证</button>
      <button class="change-btn" :class="{'change-bg':!!isChange}" :disabled="isChange" :hidden="!alreadySet" form-type="submit">修改口令</button>
    </form>
  </div>
</template>

<script type="text/ecmascript-6">
  import functions from '../../utils/functions.js'
  import cache from '../../utils/cache.js'
  import request from '../../utils/request.js'
  import login from '../../utils/login.js'
  import base64 from '../../utils/base64.js'
  import sensitivedata from '../../utils/sensitivedata.js'
export default {
  data() {
    return{
      mail:'',//新输入邮箱
      email:'',//当前邮箱
      verification:'',//验证码
      alreadySet:false,//有没有设置邮箱
      CanNotChange:false,//能不能输入邮箱
      isClick:  true, // 是否控制获取验证码的点击事件
      time: '获取验证码',
      isChange:false,//是否输入了新邮箱
      canClick1:true,//点击这个个
      canClick2:true//点击这个个
    }
  },
  beforeMount() {
    let mail = functions.getOptions().email;
    if (mail&&functions.getOptions().can==='yes'){
      this.email = this.mail = mail;
      cache.put('is_set',functions.delSet(cache.get('is_set'),4),0);
      this.alreadySet=false;
      this.isChange = true;
      this.CanNotChange = true;
      this.newEmail();
    } else {
      if(functions.checkSet(cache.get('is_set'),4)){
        this.alreadySet=true;
        this.isChange = false;
        this.getEmail()
      }
    }
  },
  onUnload() {
    this.mail = '';
    this.email = '';
    this.CanNotChange = false;
    if (!functions.checkSet(cache.get('is_set'),4)) {
      mpvue.switchTab({
        url: '../my/main'
      })
    }
  },
  onShow(){
    this.isClick = true;
    let interval = this.interval;    // 保存定时器的id
    clearInterval(interval);
    this.time = '获取验证码';
  },
  methods: {
    async successOut(callback) {
      mpvue.switchTab({
        url: '../my/main'
      });
      let time = setTimeout(callback(), 1500);
      clearTimeout(time)
    },
    async login(){
      let token = await cache.get('token');
      if (!token) {
        let code = await login.getCode();
        let data = await request.post('/user/login', {code: code}, token);
        if (data && data.status === 1) {
          cache.put('token', data.token, 7200);
          cache.put('is_set', data.is_set, 0)
        }
      }
    },
    async inputTyping(e) {
      let temp = functions.trim(e.mp.detail.value);
      this.mail = temp;
      if (this.email) {
        if (temp&&temp!==this.email){
          this.isChange = true;
        } else {
          this.isChange = false
        }
      } else {
        let reg = new RegExp("^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$");
        if (!reg.test(temp)) {
          this.isChange = false;
        } else {
          this.isChange = true;
        }
      }
    },
    async getEmail(){
      let token = await cache.get('token');
      if(token){
        let data = await request.get('/email/getEmail', {}, token);
        if (data.status===1) {
          this.email = this.mail = data.msg
        }
        return true
      } else {
        this.login().then(this.getEmail())
      }
    },
    async newEmail(){
      let mail = await this.mail;
      let reg = new RegExp("^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$");
      if (!functions.trim(mail)) {
        mpvue.showToast({
          title: "请输入邮箱",
          icon: 'none',
          duration: 1000,
          mask: true
        });
      } else if (!reg.test(mail)) {
        mpvue.showToast({
          title: "邮箱格式错误，请检查",
          icon: 'none',
          duration: 1000,
          mask: true
        });
      } else if (mail.length<=32) {
        if(functions.checkSet(cache.get('is_set'),4)){
          if (mail!==this.email){
            mpvue.navigateTo({
              url:"../checkcommand/main?where=mail&&email=" + mail
            });
            return true;
          }
        }
        let token = await cache.get('token');
        if (token) {
          let data = await request.post('/email/newEmail', {email:mail}, token);
          if(data){
            this.isClick = false;
            let times = 60; // 用于倒计时
            this.time = times+'s';
            this.interval = setInterval(() =>{
              times--;
              this.time = times+'s';
              if(times < 0){
                this.time = '重新获取';
                this.isClick = true;
                clearInterval(this.interval);
              }
            },1000);
            await mpvue.showToast({
              title: data.msg,
              icon: 'none',
              duration: 2000,
              mask: true
            });
          }
          return true;
        } else {
          this.login().then(this.newEmail())
        }
      } else {
        mpvue.showToast({
          title: "邮箱长度不能超过32，请更换",
          icon: 'none',
          duration: 1000,
          mask: true
        })
      }
    },
    async checkMail(data){
      if(this.canClick2){
        this.canClick2 = false;
        setTimeout(()=>{
          this.canClick2 = true
        }, 500);
      } else{
        return;
      }
      let verification = await data.mp.detail.value.verification;
      if (verification.length === 6&&!isNaN(verification)) {
        let token = await cache.get('token');
        if (token) {
          await request.post('/email/checkEmail', {verify:base64.encode(sensitivedata.Encrypt(verification,token))}, token).then((data)=>{
            if (data&&data.status===1){
              cache.put('is_set',functions.addSet(cache.get('is_set'),4),0);
              this.successOut(()=>{
                mpvue.showToast({
                  title: data.msg,
                  icon: 'none',
                  duration: 1500,
                  mask: true
                });
              });
            } else if(data.status===2) {
              if (!this.isChange) {
                mpvue.redirectTo({
                  url:"../command/main?can=yes"
                })
              }
            }
          });
          return true;
        } else {
          this.login().then(this.checkMail(data))
        }
      } else if (!functions.trim(verification)) {
        mpvue.showToast({
          title: "请输入验证码",
          icon: 'none',
          duration: 1000,
          mask: true
        })
      } else {
        mpvue.showToast({
          title: "验证码格式错误，请检查",
          icon: 'none',
          duration: 1000,
          mask: true
        })
      }
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
  page{
    position relative
    background: #EFEFF4;
    .create{
      margin 30% auto
      .mail{
        vertical-align: top;
        height 112rpx
        background: #ffffff;
        padding 0 20rpx
        margin 10rpx 20rpx 10rpx 20rpx
        border-radius 24rpx
        color #0B110C
        font-size 36rpx
      }
      .verification-text{
        width:48%
        vertical-align: top;
        height 112rpx
        background: #ffffff;
        padding 0 20rpx
        margin 20rpx 20rpx 10rpx 20rpx
        border-radius 24rpx
        color #0B110C
        font-size 36rpx
      }
      .verification-btn{
        position absolute
        top 134rpx
        right 22rpx
        width 38%
        height 112rpx
        line-height:112rpx;
        border-radius 34rpx
        background #005752
        color #ffffff
      }
      .nockick{
        background: #C0C0C0;
        color #0B110C
      }
      .btn{
        margin-top 80rpx
        margin-left 22rpx
        width 45%
        height 112rpx
        line-height:112rpx;
        border-radius 34rpx
        background #005752
        color #ffffff
      }
      .long-btn{
        width 92%
      }
      .change-bg{
        background: #C0C0C0 !important;
        color #0B110C
      }
      .change-btn{
        position absolute
        bottom  0rpx
        right 22rpx
        width 45%
        height 112rpx
        line-height:112rpx;
        border-radius 34rpx
        background #005752
        color #ffffff
      }
    }
  }
</style>
