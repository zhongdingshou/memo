<template>
  <div class="my">
    <div class="information-wrapper">
      <div class="avatar">
        <open-data type="userAvatarUrl" ></open-data>
      </div>
      <div class="text">
        <open-data type="userNickName" ></open-data>
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
export default {
  data() {
    return {
      myItems: []
    }
  },
  created() {
    this.iconName = ['口令设置','修改密保','邮箱设置','加密套餐','弃用小程序'];
    this.iconClass = ['icon-command','icon-file-text2','icon-mail','icon-encryption','icon-abandon'];
    this.iconType = ['command','questions','mail','encryption','abandon'];
    this.myItems = this.initIconMap();
  },
  methods: {
    initIconMap(){
      var arr = [];
      for(var i = 0;i<this.iconName.length;i++){
        this.iconClass[i] = "icon "+this.iconClass[i];
        var iconMap = {class:'',name:'',type:''};
        iconMap.class = this.iconClass[i];
        iconMap.name = this.iconName[i];
        iconMap.type = this.iconType[i];
        arr.push(iconMap);
      }
      return arr;
    },
    functionsClick(functionsType){
      funlist.achieveFunctions(functionsType);
    }

  }


}
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixin.styl";
  .my
    background: #999
    .information-wrapper
      width: 100%
      background: #005752
      padding: 15px 0
      text-align: center
      .avatar
        margin: 0 auto
        width: 64px
        height: 64px
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
      .icon
        width: 16px
        height: 16px
        color: #005752
      .text
        margin-left: 10px
        line-height: 28px
        font-size: 16px
        color: black
</style>
