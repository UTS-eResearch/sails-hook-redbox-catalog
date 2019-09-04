// Sample file for dev

module.exports = {
  workspaces: {
    portal: {
      authorization: 'Bearer 4aad88cd-8edb-4b30-9d26-53c5701a47ad'
    },
    provisionerUser: 'admin',
    parentRecord: 'rdmp',
    catalog: {
      parentRecord: 'rdmp',
      formName: 'catalog-1.0-draft',
      workflowStage: 'draft',
      appName: 'catalog',
      appId: 'catalog',
      recordType: 'catalog',
      description: 'eResearch Service',
      domain: 'https://XXXX.service-now.com',
      requestTable: 'sc_request',
      user: 'XXXX',
      password: 'XXXX',
      requesteeId: 'XXXX',
      testRequestorId:'XXXX',
    }
  }
};
