<template>
    <transition name="slide">
      <music-list :title="title" :songs="songs" :bg-image="bgImage"></music-list>
    </transition>
</template>
<script>
    import MusicList from "components/music-list/music-list"
    import {params,callback,url,ERR_OK} from "api/getSingerDetail"
    import {mapGetters} from "vuex"
    import {createSong} from "common/js/song"
    export default {
      data(){
        return {
          songs:[]
        }
      },
      components:{
        MusicList
      },
      computed:{
        title(){
          return this.singer.name
        },
        bgImage(){
          return this.singer.avatar
        },
        ...mapGetters(['singer'])
      },
      created(){
        this._getDetail();
      },
      methods:{
        _getDetail(){
            if(!this.singer.id){
              this.$router.push('/singer');
              return;
            }
            params.singermid = this.singer.id;
            this.$http.jsonp(url,{
              params:params,
              "jsonp":callback
            }).then((res)=>{
                this.songs =this._normalizeSongs(res.data.data.list);
            })
        },
        _normalizeSongs(list){
          let ret=[];
          list.forEach((item)=>{
            //等价于:let musicData = item.musicData
            let {musicData} = item;
            if(musicData.songid&&musicData.albumid){
              ret.push(createSong(musicData,this.singer.id))
            }
          })
          return ret;
        }
      }
    }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  .slide-enter-active, .slide-leave-active
    transition: all 0.3s
  .slide-enter, .slide-leave-to
    transform: translate3d(100%, 0, 0)
</style>


