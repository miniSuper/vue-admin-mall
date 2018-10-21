<template>
  <div class="avatar-wrapper" :style="styleObj">
    <img :src="avatar" class="user-avatar" alt="">
  </div>
</template>

<script type="text/ecmascript-6">
import {mapGetters} from 'vuex'
export default {
  props: {
    width: {
      type: Number,
      default: 30
    },
    height: {
      type: Number,
      default: 30
    }
  },
  computed: {
    styleObj () {
      return {
        width: this.width + 'px',
        height: this.height + 'px'
      }
    },
    ...mapGetters([
      'avatar'
    ])
  }
}
</script>

<style scoped lang="stylus">
.avatar-wrapper
  border 2px solid #94dcff
  border-radius 50%
  overflow hidden

  .user-avatar
    width 100%
    height 100%
</style>
