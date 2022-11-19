<template>
  <card title="Feature Overview">
    <el-table :data="tableData" stripe border>
      <el-table-column
        prop="feature_name"
        label="Feature Name"
        width="500"
        resizable
        sortable
      >
        <template #default="scope">
          <el-link
            type="primary"
            v-on:click.stop.prevent="goToFeature(scope.row.id)"
            >{{ scope.row.feature_name }}</el-link
          >
        </template>
      </el-table-column>
      <el-table-column label="Tags">
        <template #default="scope">
          <el-tag
            size="default"
            v-for="(item, index) in scope.row.tags"
            :key="index"
          >
            {{ item.name }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        label="Status"
        align="center"
        prop="result"
        sortable
        width="140"
      >
        <template #default="scope">
          <el-tag
            size="default"
            effect="dark"
            :type="true === scope.row.result ? 'success' : 'danger'"
          >
            <span v-if="scope.row.result">Passed</span>
            <span v-else>Failed</span>
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="total"
        fixed="right"
        label="Total"
        width="110"
        sortable
        align="center"
      />
      <el-table-column
        prop="passed"
        label="Passed"
        width="110"
        sortable
        align="center"
      />
      <el-table-column
        prop="failed"
        label="Failed"
        width="110"
        sortable
        align="center"
      />
      <el-table-column
        prop="skipped"
        label="Skipped"
        width="110"
        sortable
        align="center"
      />
    </el-table>
  </card>
</template>

<script>
import Card from "@/components/UI/card/Card.vue";

export default {
  name: "RestqaTestResultList",
  components: {
    Card,
  },
  data() {
    return {
      tableData: this.$store.getters.testReport.features,
    };
  },
  methods: {
    selectFile(val) {
      this.$store.dispatch("selectedFile", val);
    },
    successClassName({ row }) {
      return row.result ? "" : "danger-row";
    },
    goToFeature(id) {
      this.$router.push({
        name: "feature",
        params: {
          id,
        },
      });
    },
  },
};
</script>

<style></style>
