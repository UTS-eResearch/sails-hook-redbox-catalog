// Sample file for dev

module.exports = {
  workspaces: {
    portal: {
      authorization: 'Bearer xxx'
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
      domain: 'https://xxx.service-now.com',
      taskURL: '/task.do?sys_id=',
      requestTable: 'sc_request',
      user: 'xxx',
      password: 'xxx',
      openedById: 'xxx',
      assignedToEmail: 'xx.xx@xx.edu.au',
      testRequestorId: null,
    }
  }
};
