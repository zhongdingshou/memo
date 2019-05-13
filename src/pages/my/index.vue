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
      <ul v-for="(itemArray,i) of myItems" :key="i" class="function-wrapper">
        <li v-for="(item,j) in itemArray" :key="j" class="function-list">
          <div class="list-wrapper">
            <img :src='item.url' class="icon" />
            <span class="text">{{item.name}}</span>
          </div>

        </li>
      </ul>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import card from 'components/card.vue';
export default {
  data() {
    return {
      myItems: []
    }
  },
  components: {
    card
  },
  created() {
    this.imgName = ['口令设置','修改密保','邮箱设置','加密套餐','弃用小程序']
    this.imgUrl = ['command','questions','email','encryption','abandon'];
    // this.initMyItems();
    this.myItems = this.initUrlMap();
  },
  methods: {
    initUrlMap(){
      var arr = [];
      for(var i = 0;i<this.imgUrl.length;i++){
        var temp = this.imgUrl[i];
        this.imgUrl[i] = "/static/images/"+temp+".png";
        var urlMap = {url:'',name:''};
        urlMap.url = this.imgUrl[i];
        urlMap.name = this.imgName[i];
        arr.push(urlMap);
      }
      return arr;
    },
    initMyItems(){
      var arr = this.initUrlMap();
      var functionList = [];
      //将功能列表分为3组
      const colCount = 3;
      var index = 0;
      for(var i = 0; i< arr.length;i++){
        var index = parseInt(i/colCount);
        if(functionList.length<=index){
          functionList.push([]);
          functionList[index].push(arr[i]);
        }else{
          functionList[index].push(arr[i]);
        }
      }
      this.myItems = functionList;
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
      background: white
      .function-wrapper
        display: flex
        flex-wrap: wrap
        justify-content: flex-start
        border-bottom: 1px dashed #999
        &:last-child
          border: none
        .function-list
          flex: 0 0 33%
          text-align: center
          padding: 20px 0
          &:last-child .list-wrapper
            border:none
          .list-wrapper
            border-right: 1px dashed #999
            .icon
              margin: 0 auto
              display: block
              width: 24px
              height: 24px
            .text
              line-height: 28px
              font-size: 14px
              color: black


</style>
