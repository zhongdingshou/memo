<template>
  <div class="create">
    <form class='box' @submit='newEncrypted($event)'>
      <label><input class="text" name="id1" hidden type="text" :value="id[0]" ></label>
      <label><input class="text" :disabled="alreadySet" name="question1" type="text" focus :value="question1"  placeholder="问题1" maxlength="100" ></label>
      <label><input class="text" name="answer1" type="text"  :value="answer1"  placeholder="答案1" maxlength="100"  ></label>
      <label><input class="text" name="id2" hidden type="text" :value="id[1]" ></label>
      <label><input class="text" :disabled="alreadySet" name="question2" type="text"  :value="question2"  placeholder="问题2" maxlength="100" ></label>
      <label><input class="text" name="answer2" type="text"  :value="answer2"  placeholder="答案2" maxlength="100"  ></label>
      <label><input class="text" :disabled="alreadySet" name="id3" hidden type="text" :value="id[2]" ></label>
      <label><input class="text" name="question3" type="text"  :value="question3"  placeholder="问题3" maxlength="100"  ></label>
      <label><input class="text" name="answer3" type="text"  :value="answer3"  placeholder="答案3" maxlength="100" ></label>
      <button class="btn" :hidden="alreadySet" data-eventid="2" :disabled="alreadySet" form-type="submit">设置</button>
      <button class="change-btn" :hidden="!alreadySet" data-eventid="1" form-type="submit">修改口令</button>
    </form>
    <button class="reset-btn" @click="isReset()" :disabled="!alreadySet" :hidden="!alreadySet">重置</button>
  </div>
</template>

<script type="text/ecmascript-6">
  import functions from '../../utils/functions.js'
  import cache from '../../utils/cache.js'
  import request from '../../utils/request.js'
  import login from '../../utils/login.js'
export default {
  data() {
    return{
      id:[],
      question1:'',
      question2:'',
      question3:'',
      answer1:'',
      answer2:'',
      answer3:'',
      alreadySet:false,
      canClick1:true,
      canClick2:true
    }
  },
  onUnload() {
    if (!functions.checkSet(cache.get('is_set'),3)&&functions.getOptions().can==='yes') {
      request.post('/encrypted/newEncrypted', {problem:'',answer:''}, cache.get('token'));
      mpvue.switchTab({
        url: '../my/main'
      })
    }
  },
  beforeMount() {
    if (functions.getOptions().can==='yes') {
      cache.put('is_set',functions.delSet(cache.get('is_set'),3),0);
      this.id.splice(0);
      this.question1 = '';
      this.question2 = '';
      this.question3 = '';
      this.alreadySet=false
    } else {
      if(functions.checkSet(cache.get('is_set'),3)){
        this.getEncrypted();
        this.alreadySet=true
      }
    }
  },
  onShow(){
    if(functions.checkSet(cache.get('is_set'),3)){
      this.alreadySet=true
    }
  },
  methods: {
    async successOut(callback) {
      mpvue.switchTab({
        url: '../my/main'
      });
      let time = setTimeout(callback(), 1500);
      clearTimeout(time)
    },
    async isReset(){
      if(this.canClick2){
        this.canClick2 = false
        setTimeout(()=>{
          this.canClick2 = true
        }, 500);
      } else{
        return;
      }
      if(functions.checkSet(cache.get('is_set'),3)){
        await mpvue.navigateTo({
          url:"../checkcommand/main?where=questions"
        });
      }
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
    async getEncrypted(){
      let token = await cache.get('token');
      if(token){
        let data = await request.get('/encrypted/getEncrypted', {}, token);
        if (data.status===1) {
          let i = 0;
          for(let key in data.msg) {
            this.id[i] = key;
            if (i===0) {
              this.question1 = data.msg[key];
            } else if (i===1) {
              this.question2 = data.msg[key];
            } else {
              this.question3 = data.msg[key];
            }
            i++;
          }
        }
        return true;
      } else {
        this.login().then(this.getEncrypted())
      }
    },
    async newEncrypted(data){
      if(this.canClick1){
        this.canClick1 = false
        setTimeout(()=>{
          this.canClick1 = true
        }, 500);
      } else{
        return;
      }
      if (functions.checkSet(cache.get('is_set'),3)) {
        await this.checkEncrypted(data);
        return true
      }
      let problem = [];
      let answer = [];
      for (let j = 0; j<3;j++){
        let q = data.mp.detail.value['question'+(j+1)];
        let w = data.mp.detail.value['answer'+(j+1)];
        if(functions.isEmojiCharacter(q))
          q = functions.filterEmoji(q);
        if(functions.isEmojiCharacter(w))
          w = functions.filterEmoji(w);
        if (!functions.trim(q)||!functions.trim(w)) {
          await mpvue.showToast({
            title: "第"+(j+1)+"个问题或者答案为空，请检查(emoji表情自动过滤)",
            icon: 'none',
            duration: 2000,
            mask: true
          });
          return false;
        }
        problem[j]= q;
        answer[j] = w;
      }
      let token = await cache.get('token');
      if (token) {
        let data = await request.post('/encrypted/newEncrypted', {problem:problem,answer:answer}, token);
        if (data&&data.status===1){
          await cache.put('is_set',functions.addSet(cache.get('is_set'),3),0);
          this.successOut(()=>{
            mpvue.showToast({
              title: data.msg,
              icon: 'none',
              duration: 1500,
              mask: true
            });
          });
        } else {
          await mpvue.showToast({
            title: data.msg,
            icon: 'none',
            duration: 2000,
            mask: true
          });
        }
        return true;
      } else {
        this.login().then(this.newEncrypted(data))
      }
    },
    async checkEncrypted(data){
      let answer = [];
      for (let j = 0; j<3;j++){
        let w = data.mp.detail.value['answer'+(j+1)];
        if(functions.isEmojiCharacter(w))
          w = functions.filterEmoji(w);
        if (!functions.trim(w)) {
          await mpvue.showToast({
            title: "第"+(j+1)+"个答案为空，请检查(emoji表情自动过滤)",
            icon: 'none',
            duration: 2000,
            mask: true
          });
          return false;
        }
        answer[j] = w;
      }
      let token = await cache.get('token');
      if (token) {
        let data = await request.post('/encrypted/checkEncrypted', {answer:answer}, token);
        await mpvue.showToast({
          title: data.msg,
          icon: 'none',
          duration: 2000,
          mask: true
        });
        if (data&&data.status===1){
          await mpvue.redirectTo({
            url:"../command/main?can=yes"
          })
        }
        return true;
      } else {
        this.login().then(this.checkEncrypted(data))
      }
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
  page{
    background: #EFEFF4;
    position relative
    .create{
      margin 16% auto
      width 96%
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
      .reset-btn{
        margin-top 80rpx
        margin-left 20rpx
        width 45%
        height 112rpx
        line-height:112rpx;
        border-radius 34rpx
        background #005752
        color #ffffff
      }
      .change-btn{
        position absolute
        bottom  0
        right 32rpx
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
