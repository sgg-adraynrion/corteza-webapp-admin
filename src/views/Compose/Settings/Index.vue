<template>
  <b-container
    class="py-3"
  >
    <c-content-header
      :title="$t('title')"
    />

    <c-compose-editor-basic
      :basic="settings"
      :processing="basic.processing"
      :success="basic.success"
      :can-manage="canManage"
      @submit="onBasicSubmit"
    />
  </b-container>
</template>

<script>
import editorHelpers from 'corteza-webapp-admin/src/mixins/editorHelpers'
import CComposeEditorBasic from 'corteza-webapp-admin/src/components/Settings/Compose/CComposeEditorBasic'
import { mapGetters } from 'vuex'

const prefix = 'compose.'

export default {
  i18nOptions: {
    namespaces: [ 'compose.settings' ],
    keyPrefix: 'editor',
  },

  components: {
    CComposeEditorBasic,
  },

  mixins: [
    editorHelpers,
  ],

  data () {
    return {
      settings: {},

      basic: {
        processing: false,
        success: false,
      },
    }
  },

  computed: {
    ...mapGetters({
      can: 'rbac/can',
    }),

    canManage () {
      return this.can('system/', 'settings.manage')
    },
  },

  created () {
    this.fetchSettings()
  },

  methods: {
    onBasicSubmit (basic) {
      this.basic.processing = true

      const values = Object.entries(basic).map(([name, value]) => {
        return { name, value }
      })

      this.$SystemAPI.settingsUpdate({ values })
        .then(() => {
          this.animateSuccess('basic')
        })
        .catch(this.stdReject)
        .finally(() => {
          this.basic.processing = false
        })
    },

    fetchSettings () {
      this.incLoader()

      this.$SystemAPI.settingsList({ prefix })
        .then(settings => {
          settings.forEach(({ name, value }) => {
            this.$set(this.settings, name, value)
          })
        })
        .catch(this.stdReject)
        .finally(() => {
          this.decLoader()
        })
    },
  },
}
</script>
