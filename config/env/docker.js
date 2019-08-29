// Sample file for dev

module.exports = {
  workspaces: {
    portal: {
      authorization: 'Bearer TOKEN'
    },
    provisionerUser: 'admin',
    parentRecord: 'rdmp',
    labarchives: {
      parentRecord: 'rdmp',
      formName: 'catalog-1.0-draft',
      workflowStage: 'draft',
      appName: 'catalog',
      appId: 'catalog',
      recordType: 'catalog',
      description: 'Catalog Workspace'
    }
  }
};
