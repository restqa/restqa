<template>
  <card title="Tips" class="tips" emoji="💡" :loading="!message">
    <div v-auto-link class="message">{{ message }}</div>
  </card>
</template>

<script>
import Card from "@/components/UI/card/Card";
import Info from "@/services/restqa/info";

export default {
  name: "RestQATips",
  components: {
    Card
  },
  data() {
    return {
      message: ""
    };
  },
  created() {
    Info.tips()
      .then((result) => {
        this.message = result.message;
      })
      .catch(() => {
        this.message = "Share your feedback : https://restqa.io/feedback";
      });
  },
  directives: {
    "auto-link": {
      updated(el) {
        el.innerHTML = el.innerHTML.replace(
          /(https?:\/\/[a-zA-Z0-9\-_.:@!~*'(¥);/?&=+$,%#]+)/g,
          '<a href="$1" target="_blank">$1</a>'
        );
      }
    }
  }
};
</script>
<style src="./RestQATips.scss" lang="scss" />
