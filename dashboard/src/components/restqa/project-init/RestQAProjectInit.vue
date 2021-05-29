<template>
  <vx-card title="Project Initialiization" emoji="🚀"  class="mt-base" slot="no-body" >
    <div class="alert" :class="alert.type" v-if="alert.text">{{ alert.text }}</div>
    <label for="name">Name: </label>
    <input type="text" id="name" v-model="model.name" />
    <br />
    <label for="description">Description: </label>
    <input type="text" id="description" v-model="model.description" />
    <br />
    <label for="url">Url: </label>
    <input type="text" id="url" v-model="model.url" />
    <br />
    <label for="env">Environment: </label>
    <input type="text" id="env" v-model="model.env" />
    <br />
    <button id="btn" @click="submit">Create</button>
    <Loader :show="loader" />
  </vx-card>

</template>

<script>
import VxCard from '../../global/vx-card/VxCard'
import Loader from '../../utils/loader/Loader'
import * as Service from '@/services/restqa/project'
import { ValidationError } from '../../../services/http'

export default {
  name: 'RestQAProjectInit',
  components: {
    Loader,
    VxCard
  },
  props: {
  },
  data () {
    return {
      loader: false,
      model: {},
      alert: {
        text: null,
        type: null
      },
      Service
    }
  },
  methods: {
    async submit () {
      this.loader = true
      try {
        await this.Service.initialize(this.model)
        this.alert = {
          text: '🚀🚀 Your project has been created successfully!',
          type: 'success'
        }
        this.$store.dispatch('config')
      } catch (e) {
        this.alert = {
          text: e.message,
          type: (e instanceof ValidationError) ? 'warning' : 'error'
        }
      }
      this.loader = false
    }
  }
}
</script>
<style src="./RestQAProjectInit.scss" lang="scss" scoped />
