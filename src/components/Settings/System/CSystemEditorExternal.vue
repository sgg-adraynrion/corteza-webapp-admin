<template>
  <b-card
    class="shadow-sm"
    header-bg-variant="white"
    footer-bg-variant="white"
  >
    <b-form
      @submit.prevent="$emit('submit', changes)"
    >
      <b-form-group>
        <b-form-checkbox
          v-model="enabled"
          :value="true"
          :unchecked-value="false"
        >
          {{ $t('enabled') }}
        </b-form-checkbox>
      </b-form-group>

      <div v-if="enabled">
        <oidc-external
          v-for="(p, i) in oidc"
          :key="i"
          v-model="oidc[i]"
          :title="$t('oidc')"
        />

        <b-button
          @click="oidc.push({ handle: '', issuer: '', key: '', secret: '', enabled: true, fresh: true })"
        >
          {{ $t('addOidcProvider') }}
        </b-button>

        <hr>

        <standard-external
          v-model="standard.google"
          :title="$t('google')"
        />

        <hr>

        <standard-external
          v-model="standard.facebook"
          :title="$t('facebook')"
        />

        <hr>

        <standard-external
          v-model="standard.github"
          :title="$t('github')"
        />

        <hr>

        <standard-external
          v-model="standard.linkedin"
          :title="$t('linkedin')"
        />
        <hr>

        <saml-external
          v-model="saml"
          :title="$t('saml.title')"
        />
      </div>
    </b-form>

    <template #header>
      <h3 class="m-0">
        {{ $t('title') }}
      </h3>
    </template>

    <template #footer>
      <c-submit-button
        class="float-right"
        :processing="processing"
        :success="success"
        :disabled="!dirty || !canManage"
        @submit="$emit('submit', changes)"
      />
    </template>
  </b-card>
</template>

<script>
import CSubmitButton from 'corteza-webapp-admin/src/components/CSubmitButton'
import OidcExternal from 'corteza-webapp-admin/src/components/Settings/System/Auth/ExternalOIDC'
import StandardExternal from 'corteza-webapp-admin/src/components/Settings/System/Auth/ExternalStd'
import SamlExternal from 'corteza-webapp-admin/src/components/Settings/System/Auth/ExternalSAML'

export default {
  name: 'CSystemEditorExternal',

  i18nOptions: {
    namespaces: [ 'system.settings' ],
    keyPrefix: 'editor.external',
  },

  components: {
    CSubmitButton,
    OidcExternal,
    StandardExternal,
    SamlExternal,
  },

  props: {
    external: {
      type: Array,
      required: true,
    },

    processing: {
      type: Boolean,
      value: false,
    },

    success: {
      type: Boolean,
      value: false,
    },

    canManage: {
      type: Boolean,
      required: true,
    },
  },

  data () {
    return {
      enabled: false,

      oidc: [],

      standard: {
        google: {
          enabled: false,
          key: '',
          secret: '',
        },

        facebook: {
          enabled: false,
          key: '',
          secret: '',
        },

        github: {
          enabled: false,
          key: '',
          secret: '',
        },

        linkedin: {
          enabled: false,
          key: '',
          secret: '',
        },
      },

      saml: {
        enabled: false,
        cert: '',
        key: '',
        idp: {},
      },
    }
  },

  computed: {
    dirty () {
      return this.changes.length > 0
    },

    oidcProviders () {
      const prefix = `auth.external.providers.openid-connect.`

      // Set() will make sure we only get unique values
      return [...new Set(
        this.external
          // Filter out all keys that start with prefix
          .filter(v => v.name.indexOf(prefix) === 0)
          // trim off the prefix and everything after next.
          .map(({ name }) => name.substring(prefix.length).split('.', 2)[0]))]
    },

    changes () {
      let c = []
      let name = ''
      let value = ''

      for (let provider in this.standard) {
        for (let k of ['key', 'secret', 'enabled']) {
          name = `auth.external.providers.${provider}.${k}`
          value = this.standard[provider][k]
          c.push({ name, value })
        }
      }

      for (let provider of this.oidc) {
        const { handle } = provider
        if (!handle || !handle.trim()) {
          continue
        }

        for (let k of ['key', 'secret', 'enabled', 'issuer']) {
          name = `auth.external.providers.openid-connect.${handle}.${k}`
          value = provider[k]
          c.push({ name, value })
        }
      }

      // push saml
      for (let k of ['enabled', 'key', 'cert']) {
        name = `auth.external.saml.${k}`
        value = this.saml[k]
        c.push({ name, value })
      }

      for (let k of ['url', 'ident-name', 'ident-handle', 'ident-identifier']) {
        name = `auth.external.saml.idp.${k}`
        value = this.saml.idp[k]
        c.push({ name, value })
      }

      // Find out if enabled flag got changed
      name = 'auth.external.enabled'
      c.push({ name, value: this.enabled })

      return c
    },
  },

  watch: {
    external: {
      immediate: true,
      handler () {
        for (let provider in this.standard) {
          this.standard[provider] = this.extractKeys(provider, this.external, {
            enabled: false,
            secret: '',
            key: '',
          })
        }

        this.oidc = []
        for (let handle of (this.oidcProviders)) {
          this.oidc.push(this.extractKeys('openid-connect.' + handle, this.external, {
            handle,
            enabled: false,
            issuer: '',
            key: '',
            secret: '',
          }))
        }

        this.saml = {
          enabled: this.extractKey(this.external, 'auth.external.saml.enabled'),
          cert: this.extractKey(this.external, 'auth.external.saml.cert'),
          key: this.extractKey(this.external, 'auth.external.saml.key'),
          idp: {
            url: this.extractKey(this.external, 'auth.external.saml.idp.url'),
            'ident-name': this.extractKey(this.external, 'auth.external.saml.idp.ident-name'),
            'ident-handle': this.extractKey(this.external, 'auth.external.saml.idp.ident-handle'),
            'ident-identifier': this.extractKey(this.external, 'auth.external.saml.idp.ident-identifier'),
          },
        }

        this.enabled = !!(this.external.find(v => v.name === 'auth.external.enabled') || {}).value
      },
    },
  },

  methods: {
    extractKeys (provider, settings = {}, base = {}) {
      let out = { ...base }

      for (let k in base) {
        const name = `auth.external.providers.${provider}.${k}`
        out[k] = this.extractKey(settings, name, typeof out[k])
      }

      return out
    },

    extractKey (settings = {}, name, t = 'string') {
      const v = settings.find(v => v.name === name)
      if (!v) {
        return null
      }

      switch (t) {
        case 'string':
          return v.value || ''
        case 'boolean':
          return !!v.value
      }
    },
  },
}
</script>
