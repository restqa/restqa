<template>
  <div>
    <h1>Your Sandbox</h1>
    <p>
      The sandbox is the magic place where the magic happens!<br />
      Perfome request on your microservice and we generated the test scenario
      for you!
    </p>
    <el-table :row-class-name="tableRowClassName" :data="list">
      <el-table-column type="expand">
        <template #default="scope">
          <el-tabs tabPosition="right" model-value="scenario">
            <el-tab-pane label="Scenario" name="scenario">
              <h3>Generated scenario 🚀</h3>
              <pre class="debug debug-info">{{ scope.row.scenario }}</pre>
            </el-tab-pane>
            <el-tab-pane label="Request" name="request">
              <h3>Transaction request</h3>
              <pre>{{ scope.row.transaction.request }}</pre>
            </el-tab-pane>
            <el-tab-pane label="Response" name="response">
              <h3>Transaction response</h3>
              <pre>{{ scope.row.transaction.response }}</pre>
            </el-tab-pane>
          </el-tabs>
        </template>
      </el-table-column>
      <el-table-column prop="date" label="Date" />
      <el-table-column prop="transaction.request.method" label="Method" />
      <el-table-column prop="transaction.request.path" label="Path" />
      <el-table-column
        prop="transaction.response.statusCode"
        label="Status code"
      >
        <template #default="scope">
          <el-tag
            :type="getTagType(scope.row.transaction.response.statusCode)"
            disable-transitions
          >
            {{ scope.row.transaction.response.statusCode }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column>
        <template #default="scope">
          <el-button
            circle
            type="primary"
            icon="el-icon-copy-document"
            @click="copy(scope.row)"
          />
          <el-button
            circle
            type="danger"
            icon="el-icon-delete"
            @click="deleteTransaction(scope.$index)"
          />
        </template>
      </el-table-column>
    </el-table>
    <div class="progress">
      <div class="item">
        <el-progress
          :percentage="11"
          :show-text="false"
          :indeterminate="true"
        />
        <br />
        <span>Waiting for incoming transaction...</span>
      </div>
    </div>
  </div>
</template>

<script>
import {getEventSource} from "@/services/http";
import {copyText} from "vue3-clipboard";

export default {
  name: "RestQAProjectSandbox",
  data() {
    return {
      data: []
    };
  },
  computed: {
    list() {
      return this.data.map((el) => {
        const date = new Date(el.createdAt);
        const options = {
          hour12: false,
          year: "2-digit",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit"
        };
        el.date = date.toLocaleString("en-GB", options);
        return el;
      });
    }
  },
  methods: {
    tableRowClassName({row}) {
      if (row.status === "SUCCESS") {
        return "success-row";
      }
      return "";
    },
    deleteTransaction(index) {
      this.data.splice(index, 1);
    },
    copy(transaction) {
      copyText(transaction.scenario, undefined, (error) => {
        const type = error ? "error" : "success";
        const message = error
          ? "An error occured."
          : "Scenario copied into your clipboard";
        this.$notify({
          message,
          type
        });
      });
    },
    getTagType(statusCode) {
      let result = "info";
      switch (String(statusCode)[0]) {
        case "2":
          result = "success";
          break;
        case "4":
          result = "warning";
          break;
        case "5":
          result = "error";
          break;
      }
      return result;
    }
  },
  mounted() {
    const source = getEventSource();
    source.addEventListener("message", (message) => {
      this.data.unshift(JSON.parse(message.data));
    });
  }
};
</script>

<style src="./RestQAProjectSandbox.scss" lang="scss" scoped />
