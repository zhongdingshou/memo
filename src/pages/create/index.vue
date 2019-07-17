<template>
  <div class="create">
    <div class="content">
      <form class='box' @submit='creatSecret'>
        <textarea class="describe neirong" name="describe" :value="describe" maxlength="100" auto-focus="true" adjust-position focus="true" placeholder="请输入描述(建议不要出现原词，尽量使用本人知道的相关词，描述用于辅助回忆，100字以内)..."></textarea>
        <input class="account neirong" name="account" :value="account" type="text"  placeholder="请输入账号...">
        <input class="password neirong" name="password" :value="password" type="text"  placeholder="请输入密码...">
        <button class="btn" form-type="submit">提交</button>
      </form>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import functions from '../../utils/functions.js'
  import cache from '../../utils/cache.js'
  import request from '../../utils/request.js'
  import login from '../../utils/login.js'
  import sensitivedata from '../../utils/sensitivedata.js'
  import base64 from '../../utils/base64.js'
export default {
  data() {
    return {
      describe:"",
      account:"",
      password:"",
      canClick:true
    }
  },
  beforeMount() {
    if (!functions.checkSet(cache.get('is_set'),1)||!functions.checkSet(cache.get('is_set'),2)) {
      mpvue.showModal({
        title: '消息',
        content: '口令或者加密顺序未设置，无法创建备忘录',
        confirmText:'去设置',
        confirmColor:'#005752',
        success: function (res) {
          if (res.confirm) {
            mpvue.switchTab({
              url: '../my/main'
            })
          }
        }
      });
    }
  },
  onShow(){
    mpvue.getSetting({
      success(res) {
        if (!res.authSetting['scope.userInfo']) {
          mpvue.switchTab({
            url: '../index/main'
          })
        }
      }
    })
  },
  methods: {
    async login(){
      let token = await cache.get('token');
      if (!token) {
        let code = await login.getCode();
        await request.post('/user/login', {code: code}, token).then((data)=>{
          if (data && data.status === 1) {
            cache.put('token', data.token, 7200);
            cache.put('is_set', data.is_set, 0)
          }
        });
      }
    },
    async noset(callback) {
      mpvue.switchTab({
        url: '../my/main'
      });
      let time = setTimeout(callback(), 1500);
      clearTimeout(time)
  },
    async creatSecret(e) {
      if(this.canClick){
        this.canClick = false
        setTimeout(()=>{
          this.canClick = true
        }, 500);
      } else{
        return;
      }
      let is_set = await cache.get('is_set');
      if (!functions.checkSet(is_set,1)||!functions.checkSet(is_set,2)) {
        this.noset(()=>{
          mpvue.showToast({
            title: "未设置口令、加密套餐无法新建备忘录，请设置",
            icon: 'none',
            duration: 1000,
            mask: true
          });
        });
        return
      }
      let token = await cache.get('token');
      if (!token) {
        await this.login();
        token = await cache.get('token');
      }
      let describe = functions.trim(await e.mp.detail.value.describe);
      let account = functions.trim(await e.mp.detail.value.account);
      let password = functions.trim(await e.mp.detail.value.password);
      if (functions.isEmojiCharacter(describe)||functions.isEmojiCharacter(account)||functions.isEmojiCharacter(password)) {
        mpvue.showModal({
          title: '提醒！！！',
          content: '不能输入emoji表情，是否过滤？',
          cancelText:'重新编辑',
          cancelColor:'#005752',
          confirmText:'自动过滤',
          confirmColor:'#576B95',
          success: function (res) {
            if (res.confirm) {
              if (functions.isEmojiCharacter(describe))
                describe = functions.filterEmoji(describe);
              if (functions.isEmojiCharacter(account))
                account = functions.filterEmoji(account);
              if (functions.isEmojiCharacter(password))
                password = functions.filterEmoji(password);
              if (describe && account && password) {
                request.post('/secret/creatSecret', {
                  describe: describe,
                  account: account,
                  password: base64.encode(sensitivedata.Encrypt(password,token))
                }, token).then((resolve)=>{
                  mpvue.showToast({
                    title: resolve.msg,
                    icon: 'none',
                    duration: 2000,
                    mask: true
                  })
                  if (resolve.status === 1) {
                    mpvue.switchTab({
                      url: '../index/main'
                    });
                  }
                });
              } else {
                mpvue.showToast({
                  title: "所有选项内容不能为空，请检查",
                  icon: 'none',
                  duration: 2000,
                  mask: true
                })
              }
            } else if (res.cancel) {
              return false;
            }
            return false;
          }
        });
      } else {
        if (describe && account && password) {
          request.post('/secret/creatSecret', {
            describe: describe,
            account: account,
            password: base64.encode(sensitivedata.Encrypt(password,token))
          }, token).then((resolve)=>{
            mpvue.showToast({
              title: resolve.msg,
              icon: 'none',
              duration: 2000,
              mask: true
            });
            if (resolve.status === 1) {
              mpvue.switchTab({
                url: '../index/main'
              });
            }
          });
        } else {
          mpvue.showToast({
            title: "所有选项内容不能为空，请检查",
            icon: 'none',
            duration: 2000,
            mask: true
          })
        }
      }
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
  page{
    background: #EFEFF4;
  }
  .create{
    .content{
      margin 10% auto 0
      .neirong{
        background: #ffffff;
        padding 0 20rpx
        margin 10rpx 20rpx 10rpx 20rpx
        border-radius 24rpx
        color #0B110C
        font-size 36rpx
      }
      .describe{
        padding-top 20rpx
        padding-bottom 20rpx
        width 90%
        height 340rpx
      }
      .account{
        vertical-align: top;
        height 112rpx
      }
      .password{
        vertical-align: top;
        height 112rpx
      }
      .btn{
        margin-top 50rpx
        width 95%
        height 112rpx
        line-height:112rpx;
        border-radius 34rpx
        background #005752
        color #ffffff
      }
    }
  }
</style>
