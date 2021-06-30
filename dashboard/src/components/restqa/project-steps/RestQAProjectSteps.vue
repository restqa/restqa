<template>
  <card :title="title" :loading="null === data">
    <el-table :data="data" class="step-definition" style="width: 100%">
      <el-table-column class="expand" type="expand">
        <template  #default="props">
          <el-descriptions title="Detail" :column="1" border>
            <el-descriptions-item label="Keyword">{{ props.row.keyword }}</el-descriptions-item>
            <el-descriptions-item label="Comment">{{ props.row.comment }}</el-descriptions-item>
            <el-descriptions-item label="Plugin" class="plugin">{{ props.row.plugin }}</el-descriptions-item>
          </el-descriptions>
        </template>
      </el-table-column>
      <el-table-column class="step" prop="step" label="Step Definition"></el-table-column>
      <el-table-column fixed="right" label="Operations" width="120">
        <template #default="props">
          <el-button type="text" @click="copy(props.row)" size="small" >Copy</el-button>
        </template>
    </el-table-column>
    </el-table>
  </card>
  <br />
</template>

<script>
import Card from '@/components/UI/card/Card'
import { copyText } from 'vue3-clipboard'

export default {
  name: 'RestQAProjectSteps',
  components: {
    Card
  },
  props: {
    keyword: {
      type: String
    },
    data: {
      type: Array,
      default: null
    }
  },
  computed: {
    title () {
       const suffix = (this.data && ` - ${this.data.length} step definitions`)|| ''
      return `${ this.keyword[0].toUpperCase() + this.keyword.substring(1)}${suffix}`
    }
  },
  methods: {
    copy (el) {
      copyText(el.step, undefined, (error) => {
        const type = error ? 'error': 'success'
        const message = error ? error.message : 'Step copied into your clipboard'
        this.$notify({
          message,
          type
        });
      })
    }
  }
}
</script>
