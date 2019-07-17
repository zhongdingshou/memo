<template>
  <div class="create">
    <div class="title">{{title}}</div>
    <div class="main">
      <div class="backdrop">{{backdrop}}</div>
      <div class="remain" >
        <span>注意：</span>
        <li class="list" v-for="item in remain" :key="index">{{item}}</li>
      </div>
    </div>
    <div class="foot">{{foot}}</div>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  data() {
    return{
      title:'备忘录小程序使用须知',
      backdrop:'随着互联网的发展以及对安全的考虑，绝大多是应用或者程序需要账号密码进行登陆验证，用户可能会多个账号设置同一个密码，这是不安全的做法，即使每个账号设置不同的密码，根据遗忘曲线，人类的遗忘进程是很快，并且先快后慢，对于不常登陆的账号密码人类是会忘记导致无法登陆。',
      remain:[
        '1.新用户需要设置加密套餐和口令之后才能新建备忘录',
        '2.口令忘记了可以通过邮箱验证和密保验证进行重置',
        '3.修改邮箱、密保和加密套餐需要口令验证',
        '4.查看备忘录需要口令验证',
        '5.弃用小程序将删除用户所有数据',
        '6.所有备忘录使用同一套加密套餐',
        '7.不能输入emoji表情',
        '8.敏感数据传输将进行加密处理，到达目的地再解密出来',
        '9.备忘录的相关内容不要出现某网站、软件、应用的原名称，用本人知道的相关词语代替，账号密码也是，能起到辅助回忆就行，反正内容不要一模一样',
      ],
      foot:'—— by  钟 · 赵'
    }
  },
  beforeMount() {
  },
  methods: {
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
  page{
    background: #EFEFF4;
    .create{
      width 84%
      height auto
      position relative
      margin 0 auto
      .title{
        margin 40rpx auto 30rpx
        font-size 44rpx
        text-align center
        font-weight bold
        color #0B110C
      }
      .main{
        font-size 36rpx
        .backdrop{
          text-indent:72rpx;
          color #0B110C
          line-height 50rpx
        }
        .remain{
          margin-top 20rpx
          color #000000
          span{
            color #e64340
            font-size 40rpx
            margin-left:40rpx;
            margin-bottom 10rpx
            font-weight bold
          }
          .list{
            font-size 34rpx
            line-height 52rpx
            text-indent:68rpx;
            padding 10rpx 0
          }
        }
      }
      .foot {
        text-align right
        margin-top 40rpx
        margin-bottom 100rpx
        font-size: 34rpx
        color #7e8c8d
      }
    }
  }
</style>
