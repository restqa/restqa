<template>
  <div v-for="(attachment, index) in attachments" :key="index">
    <pre
      class="debug debug-info"
      v-if="attachment && attachment.type != 'media'"
      >{{ attachment.render }}</pre
    >

    <img
      class="debug debug-info"
      v-if="attachment && attachment.type == 'media'"
      :src="attachment.render"
    />
  </div>
</template>
<script>
export default {
  name: "StepAttachments",
  props: {
    data: {
      type: Array,
      required: true,
      default() {
        return [];
      },
    },
  },
  computed: {
    attachments() {
      const result = (this.data || []).map((attachment) => {
        const obj = {};
        switch (attachment.mime_type) {
          case "application/json":
            obj.type = "json";
            obj.render = JSON.stringify(
              JSON.parse(attachment.data),
              undefined,
              2
            );
            break;
          case "text/plain":
            obj.type = "text";
            obj.render = attachment.data;
            break;
          default:
            obj.type = "media";
            obj.render = `data:${attachment.mime_type};base64, ${attachment.data}`;
            break;
        }
        return obj;
      });
      return result;
    },
  },
};
</script>
<style lang="scss">
.debug {
  padding: 3px;
  //box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
  overflow: auto;

  &.debug-info {
    background: #f4f4f5;
  }

  &.debug-error {
    background: #fef0f0;
  }
}
</style>
