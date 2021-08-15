<template>
  <card
    title="Team's note"
    emoji="❤️ ❤️ ❤️ ❤️ ❤️"
    :loading="!note.message"
    class="mt-base"
  >
    <div class="team-note" v-if="note.message">
      <avatar
        class="avatar"
        :src="note.avatar"
        size="large"
        alt="team user-img"
      />
      <div class="quote">
        <div class="message">"{{ note.message }}"</div>
        <div class="from">{{ note.from }}</div>
      </div>
    </div>
  </card>
</template>

<script>
import Card from "@/components/UI/card/Card";
import Avatar from "@/components/UI/avatar/Avatar";

export default {
  name: "RestQATeamNote",
  components: {
    Card,
    Avatar
  },
  computed: {
    note() {
      const {note} = (this.$store.getters.info &&
        this.$store.getters.info.team) || {note: {}};
      return note;
    }
  }
};
</script>

<style src="./RestQATeamNote.scss" lang="scss" scoped />
