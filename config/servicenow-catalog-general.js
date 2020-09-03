// NOTE: the nested object 'catalog'
module.exports.servicenow = {
  catalog: {
    url: '',
    fields: [
      // {
      //   source_data: '', // field name in the workspace metadata
      //   dest_template: '' // the field name in the body_template config below
      // }
    ],
    body_template: {
      sysparm_quantity: "1",
      // Workaround for known issue: https://hi.service-now.com/kb_view.do?sysparm_article=KB0696054
      get_portal_messages: "true",
      variables: {
        // custom variables
      }
    }
  }
};
