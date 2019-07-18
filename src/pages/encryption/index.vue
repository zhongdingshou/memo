<template>
  <div class="create">
    <scroll-view scroll-y>
      <li  v-for="(item,index) in items" :key="index"  class="jiami-item" @click="addThis(item.id,item.name)">
        <div class="detail">{{item.name}}</div>
        <div class="icon-add_circle"></div>
      </li>
    </scroll-view>
    <div class="remain">选中套餐：</div>
    <div class="box">
      <div v-if="checkItem.length>0">
        <div class="list" v-for="(list,index) in checkItem" :key="index"  >
          <div class="matter">{{list.name}}</div>
          <div class="icon-close del" @click="del(index)"></div>
        </div>
      </div>
      <div v-else class="nodata">请点击上方需要加密套餐</div>
    </div>
    <button class="btn" @click="newEncryption()">提交</button>
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
      canClick:true,
      checkItem:[],//选中的加密，形式[0:{id:?,name:?}]
      items: []//加密总数
    }
  },
  beforeMount() {
    this.getEncryption()
  },
  onUnload(){
    this.checkItem.length=0
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
    async addThis(id,name){
      let j = 0;
      for(let i=0,len=this.checkItem.length;i<len;i++){
        if (this.checkItem[i].id === id) j++
      }
      if (j>=3) {
        await mpvue.showToast({
          title: "每种加密方式只能使用三次, 请检查",
          icon: 'none',
          duration: 1500,
          mask: true
        })
      } else {
        let itemsMap = {id:'',name:''};
        itemsMap.id = id;
        itemsMap.name = name;
        this.checkItem.push(itemsMap)
      }
    },
    async del(index){
      if (index>=0||index<this.checkItem.length)
        this.checkItem.splice(index,1);
      else {
        await mpvue.showToast({
          title: "请选择删除的对象",
          icon: 'none',
          duration: 1500,
          mask: true
        });
      }
    },
    async getEncryption(){
      let token = await cache.get('token');
      if(token){
        let data = await request.get('/encryption/getEncryption', {}, token);
        if (data.status===1) {
          let arr = [];
          for(let key in data.msg) {
            let itemsMap = {id:'',name:''};
            itemsMap.id = key;
            itemsMap.name = data.msg[key];
            arr.push(itemsMap);
          }
          this.items = arr
        }
        return true
      } else {
        this.login().then(this.getEncryption())
      }
    },
    async newEncryption(){
      if(this.canClick){
        this.canClick = false;
        setTimeout(()=>{
          this.canClick = true
        }, 500)
      } else{
        return
      }
      let combo = ',';
      for (let bb = 0; bb < this.checkItem.length;bb++) {
        combo = combo + this.checkItem[bb].id + ','
      }
      if (combo===',') {
        await mpvue.showToast({
          title: "请选择加密顺序",
          icon: 'none',
          duration: 1500,
          mask: true
        });
        return
      }
      else if (functions.getStrLen(combo) > 61) {
        await mpvue.showToast({
          title: "加密个数太多，最多只允许30个，去掉一些吧",
          icon: 'none',
          duration: 2000,
          mask: true
        });
      }
      let token = await cache.get('token');
      if (!token) {
        await this.login();
        token = await cache.get('token')
      }
      if(token){
        await request.post('/encryption/newPackage', {package:base64.encode(sensitivedata.Encrypt(combo,token))}, token).then((data)=>{
          if (data&&data.status===1){
            cache.put('is_set',functions.addSet(cache.get('is_set'),2),0);
            this.successOut(()=>{
              mpvue.showToast({
                title: data.msg,
                icon: 'none',
                duration: 2000,
                mask: true
              });
            })
          } else {
            mpvue.showToast({
              title: data.msg,
              icon: 'none',
              duration: 1500,
              mask: true
            })
          }
        });
        return true
      } else {
        this.login().then(this.newEncryption())
      }
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
  page{
    background: #EFEFF4;
    .create{
      margin 6% auto
      width 92%
      .jiami-item{
        display inline-block
        position: relative;
        background: #ffffff;
        padding 20rpx 20rpx
        margin 20rpx 20rpx 10rpx 20rpx
        border-radius 24rpx
        color #0B110C
        font-size 36rpx
      }
      .detail{
        display inline
        line-height 60rpx
      }
      .icon-add_circle{
        display inline-block
        position absolute
        top -20rpx
        right -20rpx
        width 48rpx
        height 48rpx
        margin-left 28rpx
        color #005752
        font-size 46rpx
      }
      .remain {
        width 95%
        height auto
        margin-top 40rpx
        font-size 40rpx
      }
      .box{
        width 95%
        height auto
        min-height 144rpx
        border-radius 34rpx
        padding 10rpx 20rpx 20rpx 10rpx
        margin 30rpx auto 0
        border 1rpx solid #005752
        background: #ffffff;
        .list{
          position: relative;
          display inline-block
          background: #EFEFF4;
          padding 20rpx 20rpx
          margin 20rpx 20rpx 10rpx 20rpx
          border-radius 24rpx
          boeder 2rpx solid #005752
          color #0B110C
          font-size 36rpx
        }
        .matter {
          display inline
          line-height 60rpx
          margin-right 10rpx
        }
        .del {
          color #e64340
          position absolute
          top -20rpx
          right -20rpx
          width 60rpx
          height 60rpx
          font-weight bold
          font-size 60rpx
        }
        .nodata {
          text-align center
          font-size 38rpx
          color #7e8c8d
          font-weight bold
          line-height:144rpx;
        }
      }
      .btn{
        margin-top 40rpx
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
