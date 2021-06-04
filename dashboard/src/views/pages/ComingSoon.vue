<template>
  <el-row>
    <el-col :span="12" :offset="6">
      <br />
      <br />
      <card title="The RestQA Dashboard will be ready soon!" emoji="🎁">
        <el-empty :image="img" description="Official launch in  ">
          <countdown class="countdown" :time="new Date('07/01/2021 00:00:00').getTime() - new Date().getTime()" v-slot="props">
            <div class="single-counter">
              <span class="timer">{{ props.days }}</span>
              <span>Days</span>
            </div>

            <div class="single-counter">
              <span class="timer">{{ props.hours }}</span>
              <span>Hours</span>
            </div>

            <div class="single-counter">
              <span class="timer">{{ props.minutes }}</span>
              <span>Minutes</span>
            </div>

            <div class="single-counter">
              <span class="timer">{{ props.seconds }}</span>
              <span>Seconds</span>
            </div>
          </countdown>
          <el-divider @click="devMode()" position="center">Stay updated</el-divider>
          {{ dev }}
          <br />
          <el-button  @click="chat()">💬 Discuss with us on discord</el-button>
        </el-empty>
      </card>
    </el-col>
  </el-row>
</template>


<script>
import VueCountdown from '@chenfengyuan/vue-countdown'
import Card from '@/components/UI/card/Card'

export default {
  data () {
    return {
      dev: null,
      img: require('@/assets/images/pages/rocket.png')
    }
  },
  methods: {
    chat () {
      document.location = 'https://restqa.io/chat'
    },
    devMode() {
      if (null === this.dev) this.dev = 5
      this.dev--
      if (0 === this.dev) this.$router.push({ name: 'homepage'})
    }
  },
  components: {
    'countdown': VueCountdown,
    Card
  }
}
</script>

<style lang="scss" scoped >
.countdown {
  width: 600px;
  display: flex;
  margin: 20px 0 50px 0;
  
  .single-counter {
    width: 150px;
    margin: 5px;

    span {
      &.timer {
        font-size: 3rem;
        height: 100%;

      }
      display: block;
      width: inherit;
    }
  } 

}
</style>
