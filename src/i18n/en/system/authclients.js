export default {
  navItem: {
    label: 'Auth Clients',
  },

  list: {
    title: 'Auth Clients',
    new: 'New',
    permissions: 'Permissions',
    yaml: 'YAML',
    loading: 'Loading clients',
    numFound: `{{count}} clients found`,
    numFound_plural: `{{count}} clients found`,

    filterForm: {
      query: {
        label: 'Filter clients list',
        placeholder: 'Filter clients',
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
        label: 'deleted clients',
      },
    },

    columns: {
      meta: {
        name: 'Name',
      },
      handle: 'Handle',
      enabled: 'Enabled',
      createdAt: 'Created',
      actions: '',
    },
  },

  editor: {
    title: {
      edit: 'Edit client',
      create: 'Create client',
    },
    new: 'New',
    permissions: 'Permissions',

    info: {
      title: 'Basic information',

      name: 'Name',
      handle: {
        label: 'Handle',
        disabledFootnote: 'Unable to change the handle of the default auth client',
      },

      redirectURI: 'Redirect URI\'s',
      secret: 'Secret',

      profile: 'Allow client access to user\'s profile',
      api: 'Allow client access to Corteza API on behalf of user',

      trusted: {
        label: 'Trusted',
        description: 'When client is trusted users do not see authorization step',
      },
      enabled: {
        label: 'Enabled',
        disabledFootnote: 'Unable to disable the default client',
      },

      validFrom: {
        label: 'Valid from',
        description: 'If not defined the client is valid until expiration',
      },

      expiresAt: {
        label: 'Expires at',
        description: 'If not defined the client has no expiration date',
      },

      security: {
        impersonateUser: {
          label: 'Impersonate user',
          description: 'When authenticating with client credentials, act in the name of the impersonated user',
        },

        permittedRoles: {
          label: 'Permitted roles ({{count}})',
          description: 'Only roles in this list will be added into security context when user authorizes this client',
        },
        forbiddenRoles: {
          label: 'Forbidden roles ({{count}})',
          description: 'Roles from this list will be removed from security context when user authorizes this client',
        },
        forcedRoles: {
          label: 'Forced roles ({{count}})',
          description: 'Roles from this list will be always added to security context when user authorizes this client',
        },
      },

      unnamed: 'Unnamed role',

      grant: {
        authorization_code: 'Will be used to authenticate users (grant type = authorization_code)',
        client_credentials: 'Will be used to authenticate machines (grant type = client_credentials)',
      },

      add: 'Add',
      remove: 'Remove',
      searchRoles: 'Search roles',

      uri: 'URI',
      'choose-date': 'Choose a date',
      'no-time': 'No time selected',
      delete: 'Delete',
      undelete: 'Undelete',
      deletedAt: 'Deleted at',

      updatedAt: 'Updated at',
      createdAt: 'Created at',
    },
  },
}
