<template>
  <div class="create">
    <form class='box' @submit='newCommand'>
      <input class="text" name="command" type="number" focus :value="kouling"  placeholder="请输入口令..." maxlength="4" confirm-type="验证" @confirm="newCommand" focus='true'>
      <button class="btn" v-if="alreadySet" form-type="submit">重置</button>
      <button class="btn" v-else form-type="submit">设置</button>
    </form>
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
    return{
      kouling:'',
      alreadySet:false,
      canClick:true
    }
  },
  beforeMount() {
    if(functions.checkSet(cache.get('is_set'),1)){
      if (functions.getOptions().can!=='yes'){
        mpvue.switchTab({
          url: '../my/main'
        });
      }
      this.alreadySet=true
    }
  },
  methods: {
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
    async newCommand(data){
      if(this.canClick){
        this.canClick = false
        setTimeout(()=>{
          this.canClick = true
        }, 500);
      } else{
        return;
      }
      let command = await data.mp.detail.value.command?await data.mp.detail.value.command:await data;
      if (functions.trim(command)&&parseFloat(command).toString() !== "NaN"&&command.length===4) {
        let token = await cache.get('token');
        if (token) {
          let data = await request.post('/command/newCommand', {command:base64.encode(sensitivedata.Encrypt(command,token))}, token);
          await mpvue.showToast({
            title: data.msg,
            icon: 'none',
            duration: 1500,
            mask: true
          });
          if (data&&data.status===1){
            await cache.remove('can_command');
            await cache.put('is_set',functions.addSet(cache.get('is_set'),1),0);
            mpvue.switchTab({
              url: '../my/main'
            });
          }
          return true;
        } else {
          this.login().then(this.checkCommand(command))
        }
      } else {
        mpvue.showToast({
          title: "口令为空、长度不为4或者不是数字，请检查",
          icon: 'none',
          duration: 1500,
          mask: true
        })
      }
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
  page{
    background: #EFEFF4;
    .create{
      margin 30% auto
      width 80%
      .text{
        vertical-align: top;
        height 112rpx
        background: #ffffff;
        padding 0 20rpx
        margin 10rpx 20rpx 10rpx 20rpx
        border-radius 24rpx
        color #0B110C
        font-size 36rpx
      }
      .btn{
        margin-top 80rpx
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
