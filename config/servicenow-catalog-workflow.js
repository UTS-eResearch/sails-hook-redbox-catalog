module.exports.workflow = {
  "servicenow-catalog": {
    "servicenow-catalog-draft": {
      config: {
        workflow: {
          stage: 'draft',
          stageLabel: 'Draft',
        },
        authorization: {
          viewRoles: ['Admin', 'Librarians'],
          editRoles: ['Admin', 'Librarians']
        },
        form: 'servicenow-catalog-1.0-draft'
      },
      starting: true
    },
    "servicenow-catalog-provisioning": {
      config: {
        workflow: {
          stage: 'provisioning',
          stageLabel: 'Provisioning',
        },
        authorization: {
          viewRoles: ['Admin', 'Librarians'],
          editRoles: ['Admin', 'Librarians']
        },
        form: 'servicenow-catalog-1.0-provisioning'
      }
    },
    "servicenow-catalog-provisioned": {
      config: {
        workflow: {
          stage: 'provisioned',
          stageLabel: 'Provisioned',
        },
        authorization: {
          viewRoles: ['Admin', 'Librarians'],
          editRoles: ['Admin', 'Librarians']
        },
        form: 'servicenow-catalog-1.0-provisioned'
      }
    }
  }
};
