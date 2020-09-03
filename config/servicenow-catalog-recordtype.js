module.exports.recordtype = {
  "servicenow-catalog": {
    "packageType": "workspace",
    "packageName": "servicenow-catalog",
    "searchFilters": [
      {
        name: "text_title",
        title: "search-refine-title",
        type: "exact",
        typeLabel: "search-refine-contains"
      },
      {
        name: "text_description",
        title: "search-refine-description",
        type: "exact",
        typeLabel: "search-refine-contains"
      }
    ],
    hooks: {
      onCreate: {
        pre: [

        ],
        postSync: [
          {
            function: 'sails.services.servicenowcatalogservice.submitRequest',
            options: {

            }
          }
        ]
      }
    }
  }
};
