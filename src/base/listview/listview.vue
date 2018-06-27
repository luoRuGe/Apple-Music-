<template>
    <scroll class="listview"
            :data="data"
            ref="listview"
            :listenScroll="listenScroll"
            @scroll="scroll"
            :probeType="probeType"
    >
      <ul>
        <li v-for="group in data" class="list-group" ref="listGroup">
            <h2 class="list-group-title">{{group.title}}</h2>
            <ul>
              <li v-for="item in group.items" class="list-group-item" @click="selectItem(item)">
                <img v-lazy="item.avatar" class="avatar"/>
                <span class="name">{{item.name}}</span>
              </li>
            </ul>
        </li>
      </ul>
      <div class="list-shortcut" @touchstart = "onShortcutTouchStart" @touchmove.stop.prevent="onShortcutTouchMove">
        <ul>
          <li v-for="(item,index) in shortcutList"
              class="item"
              :class="{'current':currentIndex==index}"
              :data-index="index"
          >
            {{item}}
          </li>
        </ul>
      </div>
      <div class="list-fixed" v-show="fixedTitle" ref="fixed">
        <h1 class="fixed-title">
          {{fixedTitle}}
        </h1>
      </div>
      <div class="loading-container" v-show="!data.length">
        <loading></loading>
      </div>
    </scroll>
</template>
<script>
    import Scroll from 'base/scroll/scroll'
    import Loading from "base/loading/loading"
    const ANCHOR_HEIGHT = 18;
    const TITLE_HEIGHT = 30;
    export default {
      created(){
        this.probeType = 3;
        this.touch={};
        this.listHeight=[];
        this.listenScroll = true
      },
      data(){
        return {
          currentIndex:0,
          scrollY:-1,
          diff:-1
        }
      },
      props:{
        data:{
          type:Array,
          default:[]
        }
      },
      computed:{
        shortcutList(){
          //得到遍历右侧边栏的数组，数组中的每一项都只有一个字符['热'，‘A',……“Z”]
          return this.data.map((group)=>{
            return group.title.substr(0,1)
          })
        },
        fixedTitle(){
          if(this.scrollY>0){
            return ""
          }
          return this.data[this.currentIndex]?this.data[this.currentIndex].title:""
        }
      },
      methods:{
        selectItem(singer){
          this.$emit('select',singer)
        },
        onShortcutTouchStart(e){
          //点击侧边栏，调到相应分组
          var anchorIndex = e.target.getAttribute('data-index');//字符串
          let firstTouch = e.touches[0];
          this.touch.y1 = firstTouch.pageY;
          this.touch.anchorIndex = anchorIndex;
          this._scrollTo(anchorIndex);
        },
        onShortcutTouchMove(e){
          //滑动侧边栏，调到相应分组
          let firstTouch = e.touches[0];
          this.touch.y2 = firstTouch.pageY;
          let delta = Math.floor((this.touch.y2-this.touch.y1)/ANCHOR_HEIGHT);
          let anchorIndex = +this.touch.anchorIndex + delta;
          this._scrollTo(anchorIndex);
        },
        scroll(pos){
          //监听子组件发射的scroll事件的处理函数
          this.scrollY = pos.y;
        },
        _scrollTo(index){
          if(!index&&index!=0){
            return;
          }
          //边界检测
          if(index<0){
            index = 0;
          }else if(index>this.listHeight.length-2){
            index = this.listHeight.length-2
          }
          //传入分组索引，跳到相应分组
          this.currentIndex = index;
          this.$refs.listview.scrollToElement(this.$refs.listGroup[index],0)
        },
        _calculateHeight(){
          this.listHeight=[];
          const list = this.$refs.listGroup;
          let height =0;
          this.listHeight.push(height);
          for(let i=0;i<list.length;i++){
            let item = list[i];
            height+=item.clientHeight;
            this.listHeight.push(height);
          };
        }
      },
      components:{
        Scroll,
        Loading
      },
      watch:{
        data(){
          setTimeout(()=>{
            this._calculateHeight();
          },20)
        },
        scrollY(newY){
          //检测当前滑动的距离，根据滑动的距离算出当前的index
          const listHeight = this.listHeight;
          //当滚动到上部，newY>0
          if(newY>0){
            this.currentIndex = 0;
            return;
          }
          //在中间部分滚动
          for(let i=0;i<listHeight.length;i++){
              let height1 = listHeight[i];
              let height2 = listHeight[i+1];
              if(-newY>=height1&&-newY<height2){
                this.currentIndex = i;
                //diff下一个分组距离顶部的距离
                this.diff = height2+newY;
                return;
              }
          }
          //当滚动到底部，-newY肯定大于最后一个元素的上限
          this.currentIndex = listHeight.length - 2;
        },
        diff(newVal){
          //观测下一个分组距离顶部的距离
          let fixedTop = (newVal>0&&newVal<TITLE_HEIGHT)?newVal-TITLE_HEIGHT:0;
          if(fixedTop==this.fixedTop){
            return;
          }
          this.fixedTop = fixedTop;
          this.$refs.fixed.style.transform=`translate3d(0,${fixedTop}px,0)`;
          this.$refs.fixed.style.webkitTransform=`translate3d(0,${fixedTop}px,0)`;
        }
      }
    }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  .listview
    position: relative
    width: 100%
    height: 100%
    overflow: hidden
    background: $color-background
    .list-group
      padding-bottom: 30px
      .list-group-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
      .list-group-item
        display: flex
        align-items: center
        padding: 20px 0 0 30px
        .avatar
          width: 50px
          height: 50px
          border-radius: 50%
        .name
          margin-left: 20px
          color: $color-text-l
          font-size: $font-size-medium
    .list-shortcut
      position: absolute
      z-index: 30
      right: 0
      top: 50%
      transform: translateY(-50%)
      width: 20px
      padding: 20px 0
      border-radius: 10px
      text-align: center
      background: $color-background-d
      font-family: Helvetica
      .item
        padding: 3px
        line-height: 1
        color: $color-text-l
        font-size: $font-size-small
        &.current
          color: $color-theme
    .list-fixed
      position: absolute
      top: 0
      left: 0
      width: 100%
      .fixed-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
    .loading-container
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>



