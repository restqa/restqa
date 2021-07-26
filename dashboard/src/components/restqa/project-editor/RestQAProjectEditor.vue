<template>
  <card
    :title="currentTab"
    :loading="loading"
    :emoji="!readOnly ? '🚀' : null"
    :tagLabel="readOnly ? 'Read only': null"
  >
    <el-tabs  v-show="currentTab" v-model="currentTab" type="card" closable @edit="manageTabs">
      <el-tab-pane
        v-for="(tab) in tabs"
        :key="tab.name"
        :label="tab.title"
        :name="tab.name"
      >
        <template #label>
          <span><i :class="tab.icon" class="tab-header"></i> {{ tab.title }}</span>
        </template>
        <ide :file="tab.name" @unsave="unsaved" :readOnly="readOnly"/>
        <runner :file="tab.name" @status="updateStatus" />
      </el-tab-pane>
    </el-tabs>
    <el-empty v-if="!currentTab" description="Select a feature file"></el-empty>
  </card>
</template>

<script>
import Card from '@/components/UI/card/Card'
import Ide from './ide/RestQAProjectEditorIde'
import Runner from './runner/RestQAProjectEditorRunner'

export default {
  name: 'RestQAProjectEditor',
  components: {
    Card,
    Ide,
    Runner
  },
  data() {
    return {
      loading: false,
      currentTab: null,
      tabs: [],
      success: false
    }
  },
  computed: {
    file() {
      return this.$store.getters.selectedFile
    }, 
    readOnly () {     
      return this.$store.getters.readOnly
    }
  },
  methods: {
    updateStatus(val) {
      let tabIndex = this.tabs.findIndex(_ => _.name === val.file)
      if (-1 !== tabIndex) {
        let icon = val.success ? 'el-icon-success' : 'el-icon-error'
        this.tabs[tabIndex].icon = icon
      }
    },
    unsaved (file, state) {
      const char = ' •'
      this.tabs = this.tabs.map(tab => {
        if (file === tab.name && !tab.title.includes(char) && state)  {
          tab.title = tab.title + char
        }

        if (file === tab.name && !state) {
          tab.title = tab.title.replace(char, '')
        }
        return tab
      })
    },
    manageTabs(title, action) {
      this.$store.dispatch('selectedFile', 'eee')
      let tabIndex = this.tabs.findIndex(_ => _.name == title)
      if ('add' === action) {
        if (-1 === tabIndex) {
          this.tabs.push({
            title: title.split('/').pop().split('.').shift(),
            name: title
          })
        }
        this.currentTab = title
      }

      if ('remove' === action) {
        this.currentTab = this.tabs.length > 1 ? (this.tabs[tabIndex + 1] || this.tabs[tabIndex - 1]).name : null
        this.tabs = this.tabs.filter(t => t.name !== title)
      }
    }
  },
  watch: {
    file (name) {
      this.manageTabs(name, 'add')
    }
  }
}

</script>
<style src="./RestQAProjectEditor.scss" lang="scss" scoped />
