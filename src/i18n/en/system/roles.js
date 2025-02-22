export default {
  navItem: {
    label: 'Roles',
  },

  list: {
    title: 'Roles',
    new: 'New',
    permissions: 'Permissions',
    yaml: 'YAML',
    loading: 'Loading roles',
    numFound: `{{count}} role found`,
    numFound_plural: `{{count}} roles found`,

    filterForm: {
      query: {
        label: 'Filter roles list',
        placeholder: 'Filter roles by name',
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

      archived: {
        label: 'archived roles',
      },

      deleted: {
        label: 'deleted roles',
      },
    },

    columns: {
      name: 'Name',
      createdAt: 'Created',
      handle: 'Handle',
      enabled: 'Enabled',
      actions: '',
    },
  },

  editor: {
    title: {
      edit: 'Edit role',
      create: 'Create role',
    },
    new: 'New',
    permissions: 'Permissions',

    info: {
      title: 'Basic information',

      name: 'Role name',
      handle: 'Handle',

      archive: 'Archive',
      unarchive: 'Unarchive',
      archivedAt: 'Archived at',

      delete: 'Delete',
      undelete: 'Undelete',
      deletedAt: 'Deleted at',

      updatedAt: 'Updated at',
      createdAt: 'Created at',
    },

    members: {
      title: 'Role members',

      count: 'Members ({{count}})',
      unnamed: 'Unnamed user',

      add: 'Add',
      remove: 'Remove',
      searchUsers: 'Search users',
    },
  },
}
