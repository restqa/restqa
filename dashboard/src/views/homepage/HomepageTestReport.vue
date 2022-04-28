<template>
  <el-row :gutter="20">
    <el-col :span="24">
      <el-breadcrumb separator=">">
        <el-breadcrumb-item :to="{name: 'homepage'}"
          >Dashboard</el-breadcrumb-item
        >
      </el-breadcrumb>
    </el-col>
  </el-row>
  <br />
  <el-space class="w100" direction="vertical">
    <el-row :gutter="20">
      <el-col :span="16">
        <restqa-test-result-chart-features
          :access-link="true"
        ></restqa-test-result-chart-features>
      </el-col>
      <el-col :span="8">
        <restqa-project-status></restqa-project-status>
      </el-col>
    </el-row>
    <!--
    <el-row :gutter="20">
      <el-col :span="12">
        <card title="Integration Tests" class="ccard">
          <el-descriptions :column="1" :border="true">
            <el-descriptions-item label="Environement">Testing</el-descriptions-item>
            <el-descriptions-item label="URL">https://test.example.com</el-descriptions-item>
          </el-descriptions>
          <el-divider></el-divider>
          <el-descriptions :column="1" :border="true">
            <el-descriptions-item label="Environement">Production</el-descriptions-item>
            <el-descriptions-item label="URL">https://example.com</el-descriptions-item>
          </el-descriptions>
        </card>
      </el-col>
      <el-col :span="12">
        <card title="Performance testing" class="ccard">
          <img src="@/assets/images/k6.png"/>
          <br /><br />
          <el-link type="primary">Access to your Performance tests</el-link>
        </card>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="12">
        <card title="API Specification" class="ccard">
          <img src="@/assets/images/oas3.png"/>
          <br /><br />
          <el-link type="primary">Access to your OpenAPI specification</el-link>
        </card>
      </el-col>
      <el-col :span="12">
        <card title="Postman collection" class="ccard">
          <img src="@/assets/images/postman.png"/>
          <br /><br />
          <el-link type="primary">Access to your postman collection</el-link>
        </card>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="24">
        <card title="Contributors" >
          <div class="contrib">
            <el-avatar :size="100" src="https://restqa.io/pictures/tonygo.jpeg"></el-avatar>
            <br /><br />
            Tony Go
            <br />
            <small>(36 commits)</small>
          </div>
          <div class="contrib">
            <el-avatar :size="100" src="https://restqa.io/pictures/olivier.jpeg"></el-avatar>
            <br /><br />
            Olivierodo
            <br />
            <small>(22 commits)</small>
          </div>
          <div class="contrib">
            <el-avatar :size="100" src="https://restqa.io/pictures/kat.jpeg"></el-avatar>
            <br /><br />
            Katlaz<br />
            <small>(1 commits)</small>
          <br />
          <br />
          </div>
        </card>
      </el-col>
    </el-row>
    -->
  </el-space>
</template>

<script>
//import Card from "@/components/UI/card/Card";
import RestqaTestResultChartFeatures from "@/components/restqa/test-result-charts/RestQATestResultChartFeatures.vue";
import RestqaProjectStatus from "@/components/restqa/project-status/RestQAProjectStatus.vue";

export default {
  name: "HomepageTestReport",
  components: {
    RestqaTestResultChartFeatures,
    RestqaProjectStatus
    //Card
  },
  data() {
    return {
      testReport: this.$store.getters.testReport
    };
  },
  computed: {
    name() {
      return this.testReport.name;
    }
  }
};
</script>
<style lang="scss" scoped>
.ccard {
  text-align: center;
  height: 329px;
  img {
    height: 200px;
  }
}

.contrib {
  height: 170px;
  text-align: center;
  float: left;
  margin-right: 20px;
}
</style>
