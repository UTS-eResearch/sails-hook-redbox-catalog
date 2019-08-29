module.exports.workflow = {
  "catalog": {
    "draft": {
      config: {
        workflow: {
          stage: 'draft',
          stageLabel: 'Draft',
        },
        authorization: {
          viewRoles: ['Admin', 'Librarians'],
          editRoles: ['Admin', 'Librarians']
        },
        form: 'catalog-1.0-draft'
      },
      starting: true
    }
  }
};
