<template>
  <div class="create">
    <div class="content">
      <form class='search-box' @submit='editSecret'>
        <label><input class="search-text" hidden name="id" :value="id" type="text"></label>
        <label><textarea class="describe neirong" name="describe" :value="describe" maxlength="100" placeholder="请输入描述(100字以内)..."></textarea></label>
        <label><input class="account neirong" name="account" :value="account" type="text"  placeholder="请输入账号..."></label>
        <label><input class="password neirong" name="password" :value="password" type="text"  placeholder="请输入密码..."></label>
        <button class="btn" form-type="submit">更新</button>
        <button class="del-btn" @click="delSecret(id)">删除</button>
    </form>
    </div>
  </div>
</template>

<script>
  import functions from '../../utils/functions.js'
  import cache from '../../utils/cache.js'
  import request from '../../utils/request.js'
  import login from '../../utils/login.js'
  import sensitivedata from '../../utils/sensitivedata.js'
  import base64 from '../../utils/base64.js'
    export default {
      data() {
        return {
          id:0,
          describe:'',
          account:'',
          password:'',
          canClick1:true,
          canClick2:true
        }
      },
      beforeMount() {
        let options = functions.getOptions();
        this.getDetail(options.id)
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
        async delSecret(id){
          if(this.canClick2){
            this.canClick2 = false
            setTimeout(()=>{
              this.canClick2 = true
            }, 500);
          } else{
            return;
          }
          if (id){
            let token = await cache.get('token');
            if (!token) {
              await this.login();
              token = await cache.get('token');
            }
            mpvue.showModal({
              title: '提醒！！！',
              content: '是否删除？',
              confirmText:'删除',
              confirmColor:'#FD112D',
              success: function (res) {
                if (res.confirm) {
                  let data = request.post('/secret/delSecret', {id:sensitivedata.Decrypt(id)}, token);
                  mpvue.showToast({
                    title: data.msg,
                    icon: 'none',
                    duration: 1500,
                    mask: true
                  });
                  mpvue.switchTab({
                    url: '../index/main'
                  })
                }
              }
            });
          } else {
            mpvue.showToast({
              title: "请选择需要删除的备忘录",
              icon: 'none',
              duration: 1500,
              mask: true
            })
          }
        },
        async editSecret(e){
          if(this.canClick1){
            this.canClick1 = false
            setTimeout(()=>{
              this.canClick1 = true
            }, 500);
          } else{
            return;
          }
          let token = await cache.get('token');
          if (!token) {
            await this.login();
            token = await cache.get('token');
          }
          let id = await e.mp.detail.value.id;
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
                    request.post('/secret/editSecret', {
                      id:sensitivedata.Decrypt(id),
                      describe:describe,
                      account:account,
                      password:base64.encode(sensitivedata.Encrypt(password,token))
                    }, token).then((resolve)=>{
                      mpvue.showToast({
                        title: resolve.msg,
                        icon: 'none',
                        duration: 1000,
                        mask: true
                      })
                    })
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
              request.post('/secret/editSecret', {
                id:sensitivedata.Decrypt(id),
                describe:describe,
                account:account,
                password:base64.encode(sensitivedata.Encrypt(password,token))
              }, token).then((resolve)=>{
                mpvue.showToast({
                  title: resolve.msg,
                  icon: 'none',
                  duration: 1000,
                  mask: true
                })
              })
            } else {
              mpvue.showToast({
                title: "所有选项内容不能为空，请检查",
                icon: 'none',
                duration: 2000,
                mask: true
              })
            }
          }
        },
        async getDetail(id){
          let token = await cache.get('token');
          if (!token) {
            await this.login();
            token = await cache.get('token');
          }
          await request.post('/secret/getDetail', {id:id}, token).then((data)=>{
            if (data&&data.status===1){
              this.id = sensitivedata.Encrypt(data.data.id,token);
              this.describe = data.data.describe;
              this.account = data.data.account;
              this.password = sensitivedata.Decrypt(base64.decode(data.data.password))
            }
            mpvue.showToast({
              title: data.msg,
              icon: 'none',
              duration: 1500,
              mask: true
            })
          })
        }
      }
    }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  page{
    position relative
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
    margin-left  50rpx
    width 40%
    height 112rpx
    line-height:112rpx;
    border-radius 34rpx
    background #005752
    color #ffffff
  }
    .del-btn{
      position absolute
      right  50rpx
      bottom  0rpx
      width 40%
      height 112rpx
      line-height:112rpx;
      border-radius 34rpx
      background #005752
      color #ffffff
     }
  }
  }
</style>
