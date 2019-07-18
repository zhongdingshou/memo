<template>
  <div class="my">
    <div class="information-wrapper">
      <div class="avatar">
        <open-data type="userAvatarUrl" ></open-data>
      </div>
      <div class="text">
        你好，“<open-data type="userNickName" ></open-data>”
      </div>
    </div>
    <div class="content">
      <div class="weui-cells" >
        <div class="weui-cell" v-for="(item,index) in myItems" :key="index" @click="functionsClick(item.type)">
          <div class="weui-cell__hd">
            <span :class="item.class"></span>
          </div>
          <div class="weui-cell__bd">
            <p class="text">{{item.name}}</p>
          </div>
          <div class="weui-cell__ft">
            <span class="icon icon-keyboard_arrow_right"></span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import funlist from '../../utils/funlist.js';
import functions from '../../utils/functions.js'
import cache from '../../utils/cache.js'
export default {
  data() {
    return {
      myItems: []
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
  onLoad() {
    this.iconName = ['口令设置','修改密保','邮箱设置','加密套餐','弃用小程序','关于'];
    this.iconClass = ['icon-command','icon-file-text2','icon-mail','icon-encryption','icon-abandon','icon-file-text2'];
    this.iconType = ['command','questions','mail','encryption','abandon','about'];
    this.myItems = this.initIconMap()
  },
  methods: {
    initIconMap(){
      let arr = [];
      for(let i = 0;i<this.iconName.length;i++){
        this.iconClass[i] = "icon "+this.iconClass[i];
        let iconMap = {class:'',name:'',type:''};
        iconMap.class = this.iconClass[i];
        iconMap.name = this.iconName[i];
        iconMap.type = this.iconType[i];
        arr.push(iconMap)
      }
      return arr
    },
    functionsClick(functionsType){
      if(functions.checkSet(cache.get('is_set'),1)){
        if (functionsType==='command'||functionsType==='encryption'){
          mpvue.navigateTo({
            url:"../checkcommand/main?where="+ functionsType
          });
          return
        }
      } funlist.achieveFunctions(functionsType)
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixin.styl";
  page{
    background: #EFEFF4
  }
  .my
    background: #EFEFF4
    .information-wrapper
      width: 100%
      background: #005752
      padding: 15px 0
      text-align: center
      .avatar
        margin: 0 auto
        width: 100px
        height: 100px
        border-radius: 50%
        overflow: hidden
      .text
        margin-top: 10px
        font-size: 18px
        color: white
    .content
      height: auto
      min-height: 100%
      background: #999
      .weui-cells
        margin-top: 0
        .weui-cell:hover{
          background: #EFEFF4
        }
        .weui-cell  
          .icon
            width: 16px
            height: 16px
            color: #005752
          .text
            margin-left:22rpx;
            line-height:66rpx;
            font-size:36rpx;
            color: black
</style>
