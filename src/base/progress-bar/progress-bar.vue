<template>
    <div class="progress-bar" ref="progressBar" @click="progressClick">
      <div class="bar-inner">
        <div class="progress" ref="progress"></div>
        <div class="progress-btn-wrapper"
             ref="progressBtn"
             @touchstart.prevent="progressTouchStart"
             @touchmove.prevent="progressTouchMove"
             @touchend="progressTouchEnd"
        >
          <div class="progress-btn"></div>
        </div>
      </div>
    </div>
</template>
<script>
    export default {
      props:{
        percent:{
          type:Number,
          default:0
        }
      },
      created(){
        this.touch={}
      },
      methods:{
        triggerPercent(){
          const barWidth = this.$refs.progressBar.clientWidth- this.$refs.progressBtn.clientWidth;
          const percent = this.$refs.progress.clientWidth/barWidth;
          this.$emit('percentChange',percent)
        },
        progressClick(e){
           const rect = this.$refs.progressBar.offsetLeft;
           let offsetWidth = e.pageX - rect;
           offsetWidth = Math.min(Math.max(0,offsetWidth),this.$refs.progressBar.clientWidth- this.$refs.progressBtn.clientWidth)
          console.log("click"+offsetWidth)
          this._offset(offsetWidth);
           this.triggerPercent();
        },
        progressTouchStart(e){
           this.touch.initiated = true;
           this.touch.startX = e.touches[0].pageX;
           this.touch.left = this.$refs.progress.clientWidth;
        },
        progressTouchMove(e){
            if(!this.touch.initiated){
              return;
            }
            const deltaX = e.touches[0].pageX - this.touch.startX;
            const offsetWidth = Math.min(Math.max(0,this.touch.left+deltaX),this.$refs.progressBar.clientWidth- this.$refs.progressBtn.clientWidth)
            console.log("progressTouchMove"+offsetWidth)
           this._offset(offsetWidth);
        },
        progressTouchEnd(){
          this.touch.initiated = false;
          this.triggerPercent();
        },
        _offset(offsetWidth){
          this.$refs.progress.style.width = `${offsetWidth}px`;
          this.$refs.progressBtn.style.transform = `translate3d(${offsetWidth}px,0,0)`;
          this.$refs.progressBtn.style.webkitTransform = `translate3d(${offsetWidth}px,0,0)`;
        }
      },
      watch:{
        percent(newPercent){
            if(newPercent>=0&&!this.touch.initiated){
              const barWidth = this.$refs.progressBar.clientWidth- this.$refs.progressBtn.clientWidth;
              const offsetWidth = barWidth*newPercent;
              this._offset(offsetWidth)
            }
        }
      }
    }
</script>


<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .progress-bar
    height: 30px
    .bar-inner
      position: relative
      top: 13px
      height: 4px
      background: rgba(0, 0, 0, 0.3)
      .progress
        position: absolute
        height: 100%
        background: $color-theme
      .progress-btn-wrapper
        position: absolute
        left: -8px
        top: -13px
        width: 30px
        height: 30px
        .progress-btn
          position: relative
          top: 7px
          left: 7px
          box-sizing: border-box
          width: 16px
          height: 16px
          border: 3px solid $color-text
          border-radius: 50%
          background: $color-theme
</style>


