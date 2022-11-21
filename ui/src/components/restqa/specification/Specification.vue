<template>
  <div class="swagger" id="swagger"></div>
</template>

<script>
export default {
  name: "SpecificationView",
  props: {
    data: {
      type: Object,
      require: true,
    },
  },
  methods: {
    loadSwagger(spec) {
      SwaggerUIBundle({
        spec,
        dom_id: "#swagger",
      });
    },
  },
  watch: {
    content: {
      handler(to) {
        this.loadSwagger(to);
      },
    },
  },
  mounted() {
    this.loadSwagger(this.data);
  },
};
</script>
