// NOTE: the nested object 'catalog'
module.exports.servicenow = {
  catalog: {
    // TODO: Uncomment the following fields to set the ServiceNow catalog endpoint configuration
    // Intentionally commented out so we can use Sails environment variables
    // axios: {
    //   method: 'post',
    //   url: '',
    //   auth: {
    //     username: '',
    //     password: ''
    //   }
    // },
    body_template: {
      sysparm_quantity: "1",
      // Workaround for known issue: https://hi.service-now.com/kb_view.do?sysparm_article=KB0696054
      get_portal_messages: "true",
      variables: {
        // custom variables
      }
    },
    fields: [
      // {
      //   source_field: '', // field path of the source record, note that the source object is {oid: <workspace oid>, rdmp: <rdmpData>, workspace: <workspaceData>, config: <hook options>, data: <the source data>, moment: moment, numeral:numeral }
      //                     // the field paths for 'rdmp' and 'workspace' start from the root record, e.g. 'metadata.title' refers to the title
      //   dest_field: '', // the destination field path in the body_template
      //   dest_template: '' // the template to execute (optional),
      // }
    ],
    // default as per https://developer.servicenow.com/dev.do#!/reference/api/newyork/rest/c_ServiceCatalogAPI#SCatAPIOrderNowPOST
    update_fields: [
      {
        source_field: "result.cart_id",
        dest_field: 'metadata.servicenow_cart_id'
      },
      {
        source_field: "result.number",
        dest_field: 'metadata.servicenow_number'
      },
      {
        source_field: "result.parent_id",
        dest_field: 'metadata.servicenow_parent_id'
      },
      {
        source_field: "result.parent_table",
        dest_field: 'metadata.servicenow_parent_table'
      },
      {
        source_field: "result.sys_id",
        dest_field: 'metadata.servicenow_sys_id'
      },
      {
        source_field: "result.table",
        dest_field: 'metadata.servicenow_table'
      }
    ]
  }
};
