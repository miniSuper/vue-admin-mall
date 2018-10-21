<template>
  <table class="my-table">
    <caption>表格的标题</caption>
    <thead>
      <tr>
        <th v-for="title in data.titles" :key="title">
          {{title}}
        </th>
      </tr>
    </thead>
    <tbody>
      <!-- <tr v-for="row in "></tr> -->
    </tbody>
  </table>
</template>

<script type="text/ecmascript-6">
export default {
  props: {
    data: {
      type: Object,
      default () {
        return {}
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
.my-table
  width 100%
</style>
