<template>
  <div v-if="isVisible" class="step-definition" :class="data.result.status">
    <span class="keyword">{{ data.keyword }}</span>
    <span class="step">{{ data.name }}</span>
    <el-link type="danger" icon="el-icon-error" @click.prevent="showError" class="btn btn-error" v-if="data.result.status === 'failed'">Show errors</el-link>
    <el-link type="info" icon="el-icon-info" @click.prevent="showInfo" class="btn btn-info" v-if="hasAttachement">Show info</el-link>
    <pre class="debug debug-error" v-if="show.error">{{ data.result.error_message }}</pre>
    <div v-if="show.info">
      <pre class="debug debug-info" v-for="(attachment, index) in data.embeddings" :key="index">{{ formatAttachement(attachment) }}</pre>
    </div>
  </div>
</template>
<script>
export default {
  name: 'RestQAProjectEditorRunnerStep',
  props: {
    data: {
      type: Object,
      required:true
    }
  },
  data () {
    return {
      show: {
        error: false,
        info: false
      }
    }
  },
  computed: {
    hasAttachement () {
      return (this.data.embeddings || []).length
    },
    isVisible () {
      return (this.data.embeddings && this.data.embeddings.length) || (true !== this.data.hidden) 
    }
  },
  methods : {
    showError () {
      this.show.error = !this.show.error
    },
    showInfo () {
      this.show.info = !this.show.info
    },
    formatAttachement (obj) {
      let result
      switch(obj.mime_type) {
        case 'application/json':
          result = JSON.stringify(JSON.parse(obj.data), undefined, 2)
          break
        case 'text/plain':
          result = obj.data
          break
        /*
        default:
          attachment.type = 'media'
          attachment.render = `data:${attachment.mime_type};base64, ${attachment.data}`
          break
        */
      }
      return result
    }
  }
}
</script>
<style src="./RestQAProjectEditorRunnerStep.scss" lang="scss" scoped />
