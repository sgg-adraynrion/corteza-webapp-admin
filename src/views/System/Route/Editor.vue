<template>
  <b-container class="py-3">
    <c-content-header :title="$t('title')">
      <span class="text-nowrap">
        <b-button
          v-if="routeID && canCreate"
          variant="primary"
          :to="{ name: 'system.route.new' }"
        >
          {{ $t("new") }}
        </b-button>
        <c-permissions-button
          v-if="routeID && canGrant"
          :title="route.endpoint"
          :target="route.endpoint"
          :resource="'corteza::system:apigw-route/'+routeID"
          button-variant="light"
          class="ml-2"
        >
          <font-awesome-icon :icon="['fas', 'lock']" />
          {{ $t("permissions") }}
        </c-permissions-button>
      </span>
    </c-content-header>

    <c-route-editor-info
      :route="route"
      :processing="info.processing"
      :success="info.success"
      :can-create="canCreate"
      @submit="onInfoSubmit"
      @delete="onInfoDelete"
    />
    <c-filters-stepper
      v-if="routeID"
      ref="stepper"
      :processing="stepper.processing"
      :success="stepper.success"
      :filters.sync="filters"
      :filters-to-delete.sync="filtersToDelete"
      :available-filters="availableFilters"
      :steps="steps"
      @submit="onFiltersSubmit"
    />
  </b-container>
</template>
<script>
import editorHelpers from 'corteza-webapp-admin/src/mixins/editorHelpers'
import CRouteEditorInfo from 'corteza-webapp-admin/src/components/Route/CRouteEditorInfo'
import CFiltersStepper from 'corteza-webapp-admin/src/components/Route/CFiltersStepper'
import { mapGetters } from 'vuex'
import { NoID } from '@cortezaproject/corteza-js'

export default {
  components: {
    CRouteEditorInfo,
    CFiltersStepper,
  },

  i18nOptions: {
    namespaces: ['system.routes'],
    keyPrefix: 'editor',
  },

  mixins: [editorHelpers],

  props: {
    routeID: {
      type: String,
      required: false,
      default: undefined,
    },
  },

  data () {
    return {
      route: {},

      info: {
        processing: false,
        success: false,
      },
      stepper: {
        processing: false,
        success: false,
      },
      filtersToDelete: [],
      filters: [],
      availableFilters: [],
      steps: [],
    }
  },

  computed: {
    ...mapGetters({
      can: 'rbac/can',
    }),
    canCreate () {
      return true
    },
    canGrant () {
      return true
    },
    canPin () {
      return true
    },
  },

  watch: {
    routeID: {
      immediate: true,
      handler () {
        if (this.routeID) {
          this.fetchSteps()
          this.fetchRoute()
          this.fetchAllAvailableFilters()
          this.fetchFilters()
        } else {
          this.route = {}
        }
      },
    },
  },
  methods: {
    fetchRoute () {
      this.incLoader()

      this.$SystemAPI
        .apigwRouteRead({ routeID: this.routeID, incFlags: 1 })
        .then((api) => {
          this.route = api
        })
        .catch(this.stdReject)
        .finally(() => {
          this.decLoader()
        })
    },

    onInfoSubmit (route) {
      this.info.processing = true
      if (this.routeID) {
        this.$SystemAPI
          .apigwRouteUpdate(route)
          .then(() => {
            this.animateSuccess('info')
            this.fetchRoute()
          })
          .catch(this.stdReject)
          .finally(() => {
            this.info.processing = false
          })
      } else {
        this.$SystemAPI
          .apigwRouteCreate(route)
          .then(({ routeID }) => {
            this.animateSuccess('info')
            this.$router.push({
              name: 'system.route.edit',
              params: { routeID },
            })
          })
          .catch(this.stdReject)
          .finally(() => {
            this.info.processing = false
          })
      }
    },
    onFiltersSubmit () {
      if (this.filtersToDelete.length) {
        this.deleteFilters(this.filtersToDelete)
      }
      if (this.routeID) {
        this.filters.forEach(({ ...func }, index) => {
          this.stepper.processing = true
          func.params = this.encodeParams(func.params)
          func.weight = func.weight.toString()
          if (func.updated) {
            if (func.filterID && func.filterID !== NoID) {
              this.updateFilter(func, index)
            } else {
              this.createFilter(func, index)
            }
          }
        })
      }
    },

    createFilter (func, index) {
      this.$SystemAPI
        .apigwFilterCreate({ ...func, routeID: this.routeID })
        .then(({ filterID }) => {
          this.animateSuccess('stepper')
          this.filters[index].updated = false
          this.filters[index].filterID = filterID
        })
        .catch(this.stdReject)
        .finally(() => {
          this.stepper.processing = false
        })
    },

    updateFilter (func, index) {
      this.$SystemAPI
        .apigwFilterUpdate({ ...func, routeID: this.routeID })
        .then(() => {
          this.animateSuccess('stepper')
          this.filters[index].updated = false
        })
        .catch(this.stdReject)
        .finally(() => {
          this.stepper.processing = false
        })
    },

    deleteFilters (filtersToDelete) {
      filtersToDelete.forEach((filterID, index) => {
        this.$SystemAPI
          .apigwFilterDelete({ filterID })
          .then(() => {
            this.animateSuccess('stepper')
            this.filtersToDelete.splice(index, 1)
          })
          .catch(this.stdReject)
          .finally(() => {
            this.stepper.processing = false
          })
      })
    },

    fetchFilters () {
      this.incLoader()
      this.$SystemAPI
        .apigwFilterList({ routeID: this.routeID })
        .then((api) => {
          this.setRouteFilters(api.set)
        })
        .catch(this.stdReject)
        .finally(() => {
          this.decLoader()
        })
    },

    setRouteFilters (routeFilters = []) {
      this.filters = (routeFilters || []).map((func) => {
        const f = { ...this.availableFilters.find((af) => af.ref === func.ref) }
        f.params = this.decodeParams({ ...func.params })
        f.weight = parseInt(func.weight)
        f.filterID = func.filterID
        return { ...f }
      })
    },

    decodeParams (params) {
      return Object.entries(params).map((p) => {
        return { label: p[0], value: p[1], type: 'string' }
      })
    },

    encodeParams (params) {
      return params.reduce(function (result, p) {
        result[p.label] = p.value
        return result
      }, {})
    },

    fetchAllAvailableFilters () {
      this.incLoader()
      this.$SystemAPI
        .apigwFilterDefFilter()
        .then((api) => {
          this.availableFilters = api.map((f) => {
            return { name, ...f, ref: f.name, status: 'Active', options: { checked: false } }
          })
        })
        .catch(this.stdReject)
        .finally(() => {
          this.decLoader()
        })
    },

    onInfoDelete () {
      this.incLoader()

      if (this.route.deletedAt) {
        this.$SystemAPI
          .apigwRouteUndelete({ routeID: this.routeID })
          .then(() => {
            this.fetchRoute()
          })
          .catch(this.stdReject)
          .finally(() => {
            this.decLoader()
          })
      } else {
        this.$SystemAPI
          .apigwRouteDelete({ routeID: this.routeID })
          .then(() => {
            this.fetchRoute()
          })
          .catch(this.stdReject)
          .finally(() => {
            this.decLoader()
          })
      }
    },

    fetchSteps () {
      this.incLoader()
      this.steps = ['prefilter', 'processer', 'postfilter']
    },
  },
}
</script>
