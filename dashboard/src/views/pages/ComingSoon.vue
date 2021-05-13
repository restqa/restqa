<template>
  <div class="h-screen flex w-full bg-img vx-row no-gutter justify-center items-center">
    <div class="vx-col sm:w-1/2 md:w-1/2 lg:w-2/5 m-4">
      <vx-card>

        <div class="vx-card__title mb-6">
          <h2 class="text-center">The RestQA Dashboard will be ready soon!</h2>
        </div>

        <img src="@/assets/images/pages/rocket.png" alt="coming-soon" class="mx-auto mb-2" width="150">

        <div class="count-down text-center">
          <countdown :time="new Date('07/01/2021 00:00:00').getTime() - new Date().getTime()">

            <template slot-scope="props">

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

            </template>
          </countdown>
        </div>

        <vs-divider position="center">Stay updated</vs-divider>

        <div class="subscription">
          <vs-button class="w-full" @click="chat()">💬 Discuss with us on discord</vs-button>
        </div>
      </vx-card>
    </div>
  </div>
</template>


<script>
import VueCountdown from '@chenfengyuan/vue-countdown'

export default {
  data () {
    return {
      value1: ''
    }
  },
  methods: {
    chat () {
      document.location = 'https://restqa.io/chat'
    }
  },
  components: {
    'countdown': VueCountdown
  }
}

</script>

