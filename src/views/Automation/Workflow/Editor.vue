<template>
  <b-container
    class="py-3"
  >
    <c-content-header
      :title="title"
    >
      <span
        class="text-nowrap"
      >
        <b-button
          v-if="workflowID && canCreate"
          variant="primary"
          :to="{ name: 'automation.workflow.new' }"
        >
          {{ $t('new') }}
        </b-button>
        <c-permissions-button
          v-if="workflowID && canGrant"
          :title="workflow.handle"
          :target="workflow.handle"
          :resource="'corteza::automation:workflow/'+workflowID"
          button-variant="light"
          class="ml-2"
        >
          <font-awesome-icon :icon="['fas', 'lock']" />
          {{ $t('permissions') }}
        </c-permissions-button>
      </span>
    </c-content-header>

    <c-workflow-editor-info
      :workflow="workflow"
      :processing="info.processing"
      :success="info.success"
      :can-create="canCreate"
      @submit="onInfoSubmit"
      @delete="onDelete"
    />

    <c-workflow-editor-triggers
      v-if="workflowID"
      :triggers="triggers"
      :processing="info.processing"
      :success="info.success"
    />
  </b-container>
</template>
<script>
import editorHelpers from 'corteza-webapp-admin/src/mixins/editorHelpers'
import CWorkflowEditorInfo from 'corteza-webapp-admin/src/components/Workflow/CWorkflowEditorInfo'
import CWorkflowEditorTriggers from 'corteza-webapp-admin/src/components/Workflow/CWorkflowEditorTriggers'
import { mapGetters } from 'vuex'

export default {
  components: {
    CWorkflowEditorInfo,
    CWorkflowEditorTriggers,
  },

  i18nOptions: {
    namespaces: [ 'automation.workflows' ],
    keyPrefix: 'editor',
  },

  mixins: [
    editorHelpers,
  ],

  props: {
    workflowID: {
      type: String,
      required: false,
      default: undefined,
    },
  },

  data () {
    return {
      workflow: {},
      triggers: [],

      info: {
        processing: false,
        success: false,
      },
    }
  },

  computed: {
    ...mapGetters({
      can: 'rbac/can',
    }),

    canCreate () {
      return this.can('system/', 'queue.create')
    },

    canGrant () {
      return this.can('system/', 'grant')
    },

    userID () {
      if (this.$auth.user) {
        return this.$auth.user.userID
      }
      return undefined
    },

    title () {
      return this.workflowID ? this.$t('title.edit') : this.$t('title.create')
    },
  },

  watch: {
    workflowID: {
      immediate: true,
      handler () {
        if (this.workflowID) {
          this.fetchWorkflow()
          this.fetchTriggers()
        } else {
          this.workflow = {
            ownedBy: this.userID,
            runAs: this.userID,
            enabled: true,
            meta: {
              name: '',
            },
          }
        }
      },
    },
  },

  methods: {
    fetchWorkflow () {
      this.incLoader()

      this.$AutomationAPI.workflowRead({ workflowID: this.workflowID })
        .then(this.prepare)
        .catch(this.stdReject)
        .finally(() => {
          this.decLoader()
        })
    },

    fetchTriggers () {
      this.incLoader()

      this.$AutomationAPI.triggerList({ workflowID: this.workflowID, disabled: 1 })
        .then(({ set = [] }) => { this.triggers = set })
        .catch(this.stdReject)
        .finally(() => {
          this.decLoader()
        })
    },

    onInfoSubmit (workflow) {
      this.info.processing = true

      if (this.workflowID) {
        this.$AutomationAPI.workflowUpdate(workflow)
          .then(() => {
            this.animateSuccess('info')
            this.fetchWorkflow()
          })
          .catch(this.stdReject)
          .finally(() => {
            this.info.processing = false
          })
      } else {
        this.$AutomationAPI.workflowCreate(workflow)
          .then(({ workflowID }) => {
            this.animateSuccess('info')
            this.$router.push({ name: 'automation.workflow.edit', params: { workflowID } })
          })
          .catch(this.stdReject)
          .finally(() => {
            this.info.processing = false
          })
      }
    },

    onDelete () {
      this.incLoader()

      if (this.workflow.deletedAt) {
        this.$AutomationAPI.workflowUndelete({ workflowID: this.workflowID })
          .then(() => {
            this.fetchWorkflow()
          })
          .catch(this.stdReject)
          .finally(() => {
            this.decLoader()
          })
      } else {
        this.$AutomationAPI.workflowDelete({ workflowID: this.workflowID })
          .then(() => {
            this.fetchWorkflow()
          })
          .catch(this.stdReject)
          .finally(() => {
            this.decLoader()
          })
      }
    },

    prepare (workflow = {}) {
      this.workflow = workflow
    },
  },
}
</script>
