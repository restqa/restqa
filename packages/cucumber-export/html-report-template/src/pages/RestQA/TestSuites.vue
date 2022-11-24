<template>
  <div class="dashboard-page">
    <h1 class="page-title">
      <i v-if="result.success" style="color: green" class="fa fa-thumbs-o-up"></i>
      <i v-if="!result.success" style="color: red" class="fa fa-thumbs-o-down"></i>
      {{ result.name }}
    </h1>
    <b-row>
      <b-col lg="6">
        <div class="pb-xlg h-100">
          <Widget class="h-100 mb-0" title="Features">
            <highcharts :options="featuresForChart"></highcharts>
            {{ result.total }} Features
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
      <!--   FEATURES LIST TABLE   -->
      <b-col cols="12">
        <Widget
            title="<h5>Features <span class='fw-semi-bold'>overview</span></h5>"
            bodyClass="widget-table-overflow"
            style="overflow: auto;"
            customHeader
        >
          <b-table class="features-table mt-2 table-hover" small bordered :fields="fields" :items="features" responsive="sm">
            <!--         FEATURE_NAME         -->
            <template #cell(feature_name)="data">
              <router-link :to="{name: 'FeaturePage', params: {id: data.item.id}}">
                {{ data.item.feature_name }}
              </router-link>
            </template>
            <!--         TAGS         -->
            <template #cell(tags)="data">
              <b-badge
                  v-for="(tag, idx) in data.item.tags"
                  :key="`tag-${idx}-${tag.name}`"
                  class="mt-1"
                  pill
                  style="font-size: .9em;"
                  variant="secondary"
              >
                {{ tag.name }}
              </b-badge>
            </template>
            <template #cell(status)="data">
              <b-badge
                  class="mt-1"
                  style="font-size: .9em;"
                  :variant="true === data.item.result ? 'success' : 'danger'"
              >
              {{ getResultLabel( data.item.result ) }}
              </b-badge>
            </template>
          </b-table>
        </Widget>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import Widget from '@/components/Widget/Widget'
import { Chart } from 'highcharts-vue'

export default {
  name: 'TestSuites',
  /*
  * COMPONENTS */
  components: {
    Widget,
    highcharts: Chart
  },

  /*
  * DATA */
  data () {
    return {
      fields: [
        {
          key: 'feature_name',
          label: 'Feature Name',
          class: 'feature-name'
        },
        {
          key: 'tags',
          label: 'Tags'
        },
        {
          key: 'status',
          label: 'Status'
        },
        {
          key: 'total',
          label: 'Total',
          class: 'text-center'
        },
        {
          key: 'passed',
          label: 'Passed',
          class: 'text-center'
        },
        {
          key: 'failed',
          label: 'Failed',
          class: 'text-center'
        },
        {
          key: 'skipped',
          label: 'Skipped',
          class: 'text-center'
        },
        /*{
          key: 'undefined',
          label: 'Undefined',
          class: 'text-center'
        },*/
      ],
      result: {
        total: this.getResult().total,
        passed: this.getResult().passed,
        failed: this.getResult().failed,
        name: this.getResult().name,
        success: this.getResult().success
      }
    }
  },

  /*
  * METHODS */
  methods: {
    getResultLabel (bool) {
      return  bool ? 'passed' : 'failed'
    },
    getFeatureData () {
      return [{
        label: 'Passed',
        data: this.getResult().passed
      }, {
        label: 'Skipped',
        data: this.getResult().skipped
      }, {
        label: 'Failed',
        data: this.getResult().failed
      }]
    },
    getScenarioData () {
      return [{
        label: 'Passed',
        data: this.getResult().scenarios.passed
      }, {
        label: 'Failed',
        data: this.getResult().scenarios.failed
      }, {
        label: 'skipped',
        data: this.getResult().scenarios.skipped
      }, {
        label: 'undefined',
        data: this.getResult().scenarios.undefined
      }]
    }
  },

  /*
  * COMPUTED */
  computed: {
    features () {
      return this.getResult() ? this.getResult().features : []
    },
    featuresForChart () {
      let { success, danger, info } = this.appConfig.colors
      let series = [
        {
          name: 'Features',
          data: this.getFeatureData().map(s => {
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
        colors: [success, info, danger],
        legend: {
          align: 'right',
          verticalAlign: 'middle',
          layout: 'vertical',
          itemStyle: {
            color: '#495057',
            fontWeight: 100,
            fontFamily: 'Montserrat'
          },
          itemMarginBottom: 5,
          symbolRadius: 0
        },
        exporting: {
          enabled: false
        },
        series
      }
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
            //showInLegend: true,
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
          align: 'right',
          verticalAlign: 'middle',
          layout: 'vertical',
          itemStyle: {
            color: '#495057',
            fontWeight: 100,
            fontFamily: 'Montserrat'
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
  }
}
</script>

<style lang="scss">
.features-table {
  overflow: auto;
  min-width: 36rem;

  th {
    background-color: unset !important;
    color: unset !important;
  }
}
</style>
