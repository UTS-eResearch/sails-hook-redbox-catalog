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
      taskURL: '/serviceconnect/?id=sc_request&is_new_order=true&table=sc_request&sys_id=',
      requestTable: 'sc_request',
      user: 'xxx',
      password: 'xxx',
      openedById: 'xxx',
      assignedToEmail: 'xx.xx@xx.edu.au',
      testRequestorId: null,
      items: [
        {name: 'ihpc', id: 'xxx'},
        {name: 'hpcc', id: 'xxx'},
        {name: 'storage', id: 'xxx'},
        {name: 'stash_rdmp_help', id: 'xxx'}
        ]
    }
  }
};
