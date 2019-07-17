<template>
  <div class="create">
    <div v-if="baibai">
      <navigator class="btn-close" hover-class="navigator-hover" open-type="exit" target="miniProgram" @click="quitApplet()">弃用</navigator >
    </div>
    <div v-else>
      <form class='box' @submit='checkCommand'>
      <input class="text" name="command" type="number" focus :value="kouling"  placeholder="请输入口令..." maxlength="4" confirm-type="验证" @confirm="checkCommand" focus='true'>
      <button class="btn" form-type="submit" >验证</button>
    </form>
    </div>

  </div>
</template>

<script type="text/ecmascript-6">
  import functions from '../../utils/functions.js'
  import cache from '../../utils/cache.js'
  import request from '../../utils/request.js'
  import index from '../../utils/index.js'
  import login from '../../utils/login.js'
  import base64 from '../../utils/base64.js'
  import sensitivedata from '../../utils/sensitivedata.js'
export default {
  data() {
    return{
      kouling:'',
      num:0,
      baibai:false,
      canClick1:true,
      canClick2:true
    }
  },
  onUnload() {
    this.num=0
    if (this.baibai) {
      this.quitApplet()
    }
  },
  onShow() {
    if (!functions.checkSet(cache.get('is_set'),1)) {
      this.baibai = true
    } else {
      this.baibai = false
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
    async quitApplet(){
      if(this.canClick2){
        this.canClick2 = false
        setTimeout(()=>{
          this.canClick2 = true
        }, 500);
      } else{
        return;
      }
      let token = await cache.get('token');
      await request.post('/user/quitApplet', {}, token).then(()=>{
        cache.clear();
      });
    },
    async checkCommand(data){
      if(this.canClick1){
        this.canClick1 = false
        setTimeout(()=>{
          this.canClick1 = true
        }, 500);
      } else{
        return;
      }
      let command = await data.mp.detail.value.command?await data.mp.detail.value.command:await data;
      if (functions.trim(command)&&parseFloat(command).toString() !== "NaN"&&command.length===4) {
        let token = await cache.get('token');
        if (token) {
          if (this.num>2) {
            mpvue.showToast({
              title: "无法验证，请等待时间 "+index.s_to_hs(cache.get('can_command_deadtime') - (Date.parse(new Date())/1000))+" 后再尝试",
              icon: 'none',
              duration: 3000,
              mask: true
            });
            return
          } else {
            if(cache.get('can_command')==='1'){
              let timestamp = Date.parse(new Date())/1000;//当前时间
              let can_command = await cache.get('can_command_deadtime');//限定时间
              if (can_command>timestamp) {
                mpvue.showToast({
                  title: "无法验证，请等待时间 "+index.s_to_hs(can_command - timestamp)+" 后再尝试",
                  icon: 'none',
                  duration: 3000,
                  mask: true
                });
                return
              } else {
                cache.remove('can_command');
              }
            }
          }
          await request.post('/command/checkCommand', {command:base64.encode(sensitivedata.Encrypt(command,token))}, token).then((resolve)=>{
            if (resolve&&resolve.status===1){
              if (cache.get('can_command')==='1') {
                cache.remove('can_command');
              }
              this.baibai = true
            } else {
              this.num++;
              mpvue.showToast({
                title: resolve.msg+"，还有 "+(3-this.num)+" 次机会",
                icon: 'none',
                duration: 1500,
                mask: true
              });
              if (this.num === 3) {
                cache.put('can_command','1',1800);//30min
              }
            }
          });
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
    },
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
        margin-top 100rpx
        width 95%
        height 112rpx
        line-height:112rpx;
        border-radius 34rpx
        background #005752
        color #ffffff
      }
      .btn-close{
        width 95%
        margin 30% auto
        text-align:center
        height 112rpx
        line-height:112rpx;
        border-radius 34rpx
        background #005752
        color #ffffff
      }
    }
  }
</style>
