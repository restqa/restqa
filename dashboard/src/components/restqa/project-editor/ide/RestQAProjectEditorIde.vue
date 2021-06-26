<template>
  <el-alert :title="error" v-if="error" type="error"></el-alert>
  <prism-editor class="ide" v-if="code" v-model="code" :highlight="highlighter" line-numbers></prism-editor>
</template>

<script>
  import { PrismEditor } from 'vue-prism-editor'
  import 'vue-prism-editor/dist/prismeditor.min.css'
  import { highlight, languages } from 'prismjs/components/prism-core'
  import 'prismjs/components/prism-gherkin'
  import 'prismjs/themes/prism-tomorrow.css'
  import { getFeatureFile } from '@/services/restqa/project'


  export default {
    components: {
      PrismEditor,
    },
    props: {
      file: {
        type: String,
        default: ''
        //required:true
      }
    },
    data() {
      return {
        code: '',
        error: ''
      }
    },
    methods: {
      highlighter(code) {
        return highlight(code, languages.gherkin)
      }
    },
    mounted () {
      if (!this.file) {
        this.error = 'An error occured: the file can\'t be loaded'
        return 
      }
      getFeatureFile(this.file)
        .then(res => {
          this.code = res
        })
        .catch(e => {
          this.error = 'An error occured: ' + e.message
        })
    }
  };
</script>

<style src="./RestQAProjectEditorIde.scss" lang="scss" scoped />
