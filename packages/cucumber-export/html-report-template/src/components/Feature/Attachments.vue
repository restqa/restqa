<template>
<div class="attachements">
  <h6><i class="fa fa-plus-circle"></i> Information:</h6>
  <pre 
    v-for="(attachment, attId) in attachments"
    :key="`attachments-txt-${attId}`"
    :class="attachment.type"
    v-if="attachment.type != 'media'"
    >{{ attachment.render }}</pre>
  <img
    v-for="(attachment, attId) in attachments"
    :key="`attachments-img-${attId}`"
    :class="attachment.type"
    v-if="attachment.type == 'media'"
    :src="attachment.render"
    />
</div>
</template>
<script>
export default {
  name: 'Attachment',
  props: {
    data: { 
      type: Array
    },
  },
  data () {
    return {
      attachments: this.data.map(attachment => {
        switch(attachment.mime_type) {
          case 'application/json':
            attachment.type = 'json'
            attachment.render = JSON.stringify(JSON.parse(attachment.data), undefined, 2)
            break
          case 'text/plain':
            attachment.type = 'text'
            attachment.render = attachment.data
            break
          default:
            attachment.type = 'media'
            attachment.render = `data:${attachment.mime_type};base64, ${attachment.data}`
            break
        }
        return attachment
      })
    }
  },
}
</script>

<style src="./Attachments.scss" lang="scss" scoped />
