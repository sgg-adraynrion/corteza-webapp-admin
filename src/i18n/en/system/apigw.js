export default {
  navItem: {
    label: 'API Gateway',
  },

  list: {
    title: 'API Gateway',
    new: 'New',
    permissions: 'Permissions',
    yaml: 'YAML',
    loading: 'Loading routes',
    numFound: `{{count}} route found`,
    numFound_plural: `{{count}} routes found`,

    filterForm: {
      query: {
        label: 'Filter API Gateway list',
        placeholder: 'Filter routes by name',
      },

      excluded: {
        label: 'Without',
      },

      inclusive: {
        label: 'Including',
      },

      exclusive: {
        label: 'Only',
      },

      deleted: {
        label: 'Deleted routes',
      },
    },

    columns: {
      endpoint: 'Endpoint',
      createdAt: 'Created',
      enabled: 'Enabled',
      actions: '',
    },
  },

  editor: {
    title: 'Edit route',
    new: 'New',
    permissions: 'Permissions',

    info: {
      title: 'Basic information',

      id: 'ID',
      endpoint: 'Endpoint',
      method: 'Method',
      enabled: 'Enabled',

      delete: 'Delete',
      undelete: 'Undelete',
      deletedAt: 'Deleted at',

      updatedAt: 'Updated at',
      createdAt: 'Created at',
      validEndpoint: 'Invalid endpoint format',
    },
    filters: {
      title: 'Filter list',
      modal: {
        title: 'Query parameters verifier',
        ok: 'Save & Close',
        statusActive: 'Active',
        statusDisabled: 'Disabled',
      },
      step_title: {
        prefilter: 'Prefiltering',
        processer: 'Processing',
        postfilter: 'Postfiltering',
      },
      list: {
        remove: 'Remove',
        filters: 'Filters',
        status: 'Status',
        actions: 'Actions',
        active: 'Active',
        noFiltersMsg: 'Please add a filter!',
      },
      labels: {
        expr: 'Expression',
        location: 'Location',
        workflow: 'Workflow',
        status: 'HTTP Status',
      },

      add: 'Add',
      addFilter: 'Add filter',
      params: 'Params',
      filterListEmpty: 'Filter list is empty!',
    },
  },

}
