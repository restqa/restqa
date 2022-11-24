<template>
  <div class="dashboard-page">
    <h1 class="page-title">
      <i v-if="feature.result" style="color: green" class="fa fa-thumbs-o-up"></i>
      <i v-if="!feature.result" style="color: red" class="fa fa-thumbs-o-down"></i>
      Feature:  {{ feature.feature_name }}
    </h1>
    <b-row>
      <!--   SCENARIOS PIE-CHART   -->
      <b-col lg="6">
        <div class="pb-xlg h-100">
          <Widget class="h-100 mb-0" >
            <h3>Feature <span class="fw-semi-bold">Detail</span></h3>
            <p>{{ feature.feature_name }}</p>
            <div class="table-responsive">
              <table class="table table-hover">
                <tbody>
                  <tr>
                    <td style="text-align: right"><i class="fa fa-tag"> </i> Tags</td>
                    <td style="text-align: left">{{ feature.tags.map(_ => _.name).join(' ') }}</td>
                  </tr>
                  <tr>
                    <td style="text-align: right"> <i class="fa fa-chain"></i> Unique identifier</td>
                    <td style="text-align: left">{{ feature.id }}</td>
                  </tr>
                  <tr>
                    <td style="text-align: right"><i class="fa fa-file-o"></i> Filename</td>
                    <td style="text-align: left">{{ feature.uri }}</td>
                  </tr>
                  <tr>
                    <td style="text-align: right"><i class="fa fa-clock-o"></i> Time</td>
                    <td style="text-align: left">{{ feature.timestamp }}</td>
                  </tr>
                  <tr>
                    <td style="text-align: right"><i class="fa fa-bars"></i> Total Scenario </td>
                    <td style="text-align: left">{{ feature.total }}</td>
                  </tr>
                  <tr>
                    <td style="text-align: right"><i class="fa fa-trophy"></i> Scenario passed </td>
                    <td style="text-align: left"><b-badge variant="success" pill>{{ feature.passed }}</b-badge></td>
                  </tr>
                  <tr>
                    <td style="text-align: right"><i class="fa fa-ambulance"></i> Scenario failed </td>
                    <td style="text-align: left"><b-badge variant="danger" pill>{{ feature.failed }}</b-badge></td>
                  </tr>
                  <tr>
                    <td style="text-align: right"><i class="fa fa-waring"></i> Scenario skipped </td>
                    <td style="text-align: left"><b-badge variant="info" pill>{{ feature.skipped }}</b-badge></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Widget>
        </div>
      </b-col>
      <b-col lg="6">
        <div class="pb-xlg h-100">
          <Widget class="h-100 mb-0" title="Scenarios">
            <highcharts :options="scenariosForChart"></highcharts>
          </Widget>
        </div>
      </b-col>

      <!--   SCENARIOS' COLLAPSES   -->
      <b-col cols="12">
        <Widget
            v-for="(scenario) in scenariosOfFeature"
            :key="`scenario-accordion-${scenario.id}`"
        >
          <!--     SCENARIO COLLAPSE TITLE     -->
          <div
              v-b-toggle="`scenario-accordion-${scenario.id}`"
              style="outline: none;"
              class="d-flex justify-content-between flex-column"
          >
            <!--     SCENARIO TAGS       -->
            <div
                v-if="scenario.tags && scenario.tags.length > 0"
            >
              <span class="mr-2 glyphicon glyphicon-tags" aria-hidden="true"></span>
              <b-badge
                  v-for="(tag, tagIdx) in scenario.tags"
                  :key="`scenario-tag-${tagIdx}`"
                  class="mr-1"
                  pill
                  variant="secondary"
              >
                {{ tag.name }}
              </b-badge>
            </div>
            <br />

            <div
                class="d-flex align-items-center justify-content-between"
            >
              <h4>
                <i v-if="scenario.result" style="color: green" class="fa fa-thumbs-o-up"></i>
                <i v-if="!scenario.result" style="color: red" class="fa fa-thumbs-o-down"></i>
                Scenario: <b :class="scenario.result ? '' : 'error-title'">{{ scenario.name }}</b>
              </h4>
              <div class="d-flex align-items-center">
                <span class="mr-5">Duration: {{ scenario.duration }}</span>
                <b-badge variant="success" class="mr-2"><span class="sr-only">passed</span>{{ scenario.step_passed }}
                </b-badge>
                <b-badge variant="danger" class="mr-2"><span class="sr-only">failed</span>{{ scenario.step_failed }}
                </b-badge>
                <b-badge variant="primary" class="mr-2"><span class="sr-only">skipped</span>{{ scenario.step_skipped }}
                </b-badge>
                <b-badge variant="secondary" class="mr-2"><span class="sr-only">undefined</span>{{
                    scenario.step_undefined
                  }}
                </b-badge>
                <span class="when-opened glyphicon glyphicon-chevron-up" aria-hidden="true"></span>
                <span class="when-closed glyphicon glyphicon-chevron-down" aria-hidden="true"></span>
              </div>
            </div>
          </div>
          <hr>
          <!--     SCENARIO COLLAPSE DETAILS     -->
          <b-collapse :id="`scenario-accordion-${scenario.id}`" role="tabpanel">
            <Steps 
              v-for="(step, stepIdx) in scenario.steps"
              :key="`scenario-step-${stepIdx}`"
              :data="step"
              />
          </b-collapse>
        </Widget>
      </b-col>
    </b-row>
  </div>
</template>

<script>
const getLegendGlyphiconClass = function (legend) {
  return legend.toLowerCase() === 'passed' ?
      'ok' : legend.toLowerCase() === 'failed' ?
          'exclamation-sign' : legend.toLowerCase() === 'skipped' ?
              'circle-arrow-right' : legend.toLowerCase() === 'undefined' ?
                  'question-sign' : ''
}
const getLegendColor = function (legend) {
  return legend.toLowerCase() === 'passed' ?
      'text-success' : legend.toLowerCase() === 'failed' ?
          'text-danger' : legend.toLowerCase() === 'skipped' ?
              'text-primary' : legend.toLowerCase() === 'undefined' ?
                  'text-secondary' : ''
}

import Widget from '@/components/Widget/Widget'
import Steps from '@/components/Feature/Steps'
import { Chart } from 'highcharts-vue'

export default {
  name: 'FeaturePage',
  components: {
    highcharts: Chart,
    Steps,
    Widget
  },
  /*
  * DATA */
  data () {
    return {
      feature: this.getResult() ? this.getResult().features.find(feature => feature.id === this.$route.params.id) : {}
    }
  },

  /*
  * COMPUTED */
  computed: {
    scenariosOfFeature () {
      return this.feature.elements
    },
    scenariosForChart () {
      let { success, danger, info, secondary } = this.appConfig.colors
      let series = [
        {
          name: 'Scenarios',
          data: this.getScenarioData().map(s => {
            return {
              name: s.label,
              y: s.data
            }
          })
        }
      ]
      return {
        chart: {
          type: 'pie',
          height: 300
        },
        credits: {
          enabled: false
        },
        title: false,
        plotOptions: {
          pie: {
            dataLabels: {
              enabled: true,
              format: '<b>{point.name}</b>:<br>{point.percentage:.1f} %<br>value: {point.y}'
            },
            borderColor: null,
            showInLegend: true,
            innerSize: 100,
            size: 200,
            states: {
              hover: {
                halo: {
                  size: 1
                }
              }
            }
          }
        },
        colors: [success, danger, info, secondary],
        legend: {
          symbolPadding: 0,
          symbolWidth: 0,
          symbolHeight: .0001,
          align: 'right',
          layout: 'vertical',
          verticalAlign: 'middle',
          margin: 5,
          itemMarginLeft: 2,
          x: 0,
          y: 0,
          itemDistance: 1,
          itemStyle: {
            color: '#495057',
            fontWeight: 100,
            fontFamily: 'Montserrat'
          },
          allowHTML: true,
          useHTML: true,
          labelFormatter: function () {
            return `<h6 class="${getLegendColor(this.name)}"><span class="mr-2 glyphicon glyphicon-${getLegendGlyphiconClass(this.name)}" aria-hidden="true"></span>${this.name}</h6>`
          },
          itemMarginBottom: 5,
          symbolRadius: 0
        },
        exporting: {
          enabled: false
        },
        series
      }
    }
  },

  /*
  * METHODS */
  methods: {
    getScenarioData () {
      return [{
        label: 'Passed',
        data: this.feature.passed
      }, {
        label: 'Failed',
        data: this.feature.failed
      }, {
        label: 'skipped',
        data: this.feature.skipped
      }, {
        label: 'undefined',
        data: this.feature.undefined
      }]
    },
  },

  /*
  * BEFORE_ROUTE_UPDATE */
  beforeRouteUpdate (to, from, next) {
    this.feature = this.getResult() ? this.getResult().features.find(feature => feature.id === to.params.id) : {}
    next()
  }
}
</script>

<style lang="scss">
.collapsed .when-opened,
.not-collapsed .when-closed {
  display: none;
}
.error-title {
  color: red;
}
</style>
