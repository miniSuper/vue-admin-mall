<template>
  <div class="detail-set">
    <quill-editor v-model="content" :options="editorOption" @blur="onEditorBlur($event)" @focus="onEditorFocus($event)" @change="onEditorChange($event)"></quill-editor>
    <div class="buttons">
      <el-button type="primary" @click="saveSettings">保存</el-button>
      <el-button @click="cancelEdit">撤销</el-button>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

import { quillEditor } from 'vue-quill-editor'
import {getGoodsDetailsInfo} from '@/api/goods'
export default {
  props: {
    goodsId: 0
  },
  data () {
    return {
      content: '',
      editorOption: {
        theme: 'snow'
      },
      detailForm: {
        description: ''
      },
      contentBefore: ''
    }
  },
  watch: {
    content () {
      this.$set(this.detailForm, 'description', {description: this.content})
      this.autoSave()
    }
  },
  methods: {
    autoSave () {
      // let description = this.detailForm.description
      // description.goods_id = this.goodsId
      // let data = JSON.stringify(description)
      // this.$set(this.detailForm, 'description', data)
      this.detailForm.description.goods_id = this.goodsId
      this.$emit('saveSettings', {description: JSON.stringify(this.detailForm.description)})
    },
    saveSettings () {
      this.autoSave()
      this.$message({
        type: 'success',
        message: '信息已保存'
      })
    },
    cancelEdit () {
      this.content = this.contentBefore
    },
    onEditorBlur (editor) { // 失去焦点事件
      console.log('blur')
    },
    onEditorFocus (editor) { // 获得焦点事件
      console.log('focus')
    },
    onEditorChange ({editor, html, text}) { // 编辑器文本发生变化
      // this.content可以实时获取到当前编辑器内的文本内容
      // console.log(this.content)
    },
    pullGoodsDetails () {
      if (this.goodsId === 0) return
      getGoodsDetailsInfo(this.goodsId)
        .then(res => {
          console.log(res)
          this.content = res.data.data.GoodsDetail.description
          this.contentBefore = res.data.data.GoodsDetail.description
          if (res.data.data.GoodsDetail.description !== '') {
            this.$emit('firstCommit', false)
          } else {
            this.$emit('firstCommit', true)
          }
        })
        .catch(err => console.log(err))
    }

  },
  components: {
    quillEditor
  },
  mounted () {
    this.pullGoodsDetails()
  }
}
</script>

<style scoped lang="stylus">
.detail-set
  margin 40px 0 140px 0

  .buttons
    padding 10px 0
    margin-top 30px
    margin-left 30px

  >>>.quill-editor
    position relative
    overflow scroll

    .ql-container
      min-height 600px

    .ql-tooltip
      top -12px !important
      left 130px !important

    .ql-picker-options
      top 40px
</style>
