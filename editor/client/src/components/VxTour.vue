<template>
    <v-tour name="vuexyTour" :steps="steps">
        <template slot-scope="tour">
            <transition name="fade">
                <v-step
                    v-if="tour.currentStep === index"
                    v-for="(step, index) of tour.steps"
                    :key="index"
                    :step="step"
                    :previous-step="tour.previousStep"
                    :next-step="tour.nextStep"
                    :stop="tour.stop"
                    :is-first="tour.isFirst"
                    :is-last="tour.isLast"
                    :labels="tour.labels">

                    <div slot="actions" class="flex justify-center">
                        <vs-button
                            size="small"
                            class="mr-3"
                            @click="tour.stop"
                            icon-pack="feather"
                            icon="icon-x"
                            icon-after
                            color="#fff"
                            type="border"
                            v-if="tour.currentStep != tour.steps.length - 1">
                            Skip
                        </vs-button>

                        <vs-button
                            size="small"
                            @click="tour.previousStep"
                            icon-pack="feather"
                            icon="icon-chevrons-left"
                            color="#fff"
                            type="border"
                            class="mr-3"
                            v-if="tour.currentStep">
                            Previous
                        </vs-button>

                        <vs-button
                            size="small"
                            @click="tour.nextStep"
                            icon-pack="feather"
                            icon="icon-chevrons-right"
                            icon-after
                            color="#fff"
                            type="border"
                            class="btn-tour-next"
                            v-if="tour.currentStep != tour.steps.length - 1">
                            Next
                        </vs-button>

                        <vs-button
                            size="small"
                            @click="tour.stop"
                            icon-pack="feather"
                            icon="icon-check-circle"
                            icon-after
                            color="#fff"
                            type="border"
                            class="btn-tour-finish"
                            v-if="tour.currentStep == tour.steps.length - 1">
                            Finish
                        </vs-button>
                    </div>

                </v-step>
            </transition>
        </template>
    </v-tour>
</template>

<script>
export default{
  name: 'vx-tour',
  props: {
    steps: {
      required: true,
      type: Array
    }
  },
  watch: {
    '$route.path' () {
      this.$tours['vuexyTour'].stop()
    }
  },
  mounted () {
    this.$tours['vuexyTour'].start()
  }
}
</script>

<style lang="scss">
.v-tour {
    .v-step {
        z-index: 55000;
        background-color: rgba(var(--vs-primary),1);
        border-radius: .5rem;
        padding: 1.5rem;
        filter: drop-shadow(0 0 7px rgba(0,0,0,.5));

        .v-step__arrow {
            border-color: rgba(var(--vs-primary),1);
        }

        .vs-button-border:not(.btn-tour-next):not(.btn-tour-finish) {
            border-color: rgba(255, 255, 255, .5) !important;
        }
    }
}
</style>
