<template>
  <div class="list-item">
    <div>
      <el-radio v-model="radio" label="1">备选项</el-radio>
      <div>
        <span>创建时间:{{data.createdTime}}</span>

      </div>
    </div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  props: {
    data: {
      type: Object,
      default () {
        return {
          pic: '/static/avatar.jpg',
          code: 2049485896,
          createdTime: '2018-07-26 20:30:29',
          price: 230.99,
          stock: 200,
          soldNum: 20,
          type: '实物类'
        }
      }
    }
  },
  data () {
    return {

    }
  },
  components: {

  }
}
</script>

<style scoped lang="stylus">
</style>
