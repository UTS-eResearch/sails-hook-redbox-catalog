/**
 * Template form
 */
module.exports = {
  name: 'catalog-1.0-draft',
  type: 'catalog',
  customAngularApp: {
    appName: 'catalog',
    appSelector: 'catalog-form'
  },
  skipValidationOnSave: true,
  editCssClasses: 'row col-md-12',
  viewCssClasses: 'row col-md-offset-1 col-md-10',
  messages: {
    'saving': ['@dmpt-form-saving'],
    'validationFail': ['@dmpt-form-validation-fail-prefix', '@dmpt-form-validation-fail-suffix'],
    'saveSuccess': ['@dmpt-form-save-success'],
    'saveError': ['@dmpt-form-save-error']
  },
  fields: [
    {
      class: 'Container',
      compClass: 'TextBlockComponent',
      viewOnly: false,
      definition: {
        name: 'title',
        value: 'UTS eResearch Service Catalogue (prototype)',
        type: 'h2'
      }
    },
    {
      class: 'CatalogDisplayField',
      editOnly: true,
      definition: {
        name: 'CatalogDisplay',
        services: [
          {
            id: 'hpc',
            name: 'High Performance Computing Cluster',
            displayName: false,
            logo: 'assets/images/uts_hpcs.png',
            desc: 'UTS eResearch manages two High Performance Computing Clusters that can be accessed by UTS researchers.',
            requestButton: 'Create Request',
            defaultForm: false,
            help: '',
            form: {
              name: {enable: false},
              type: {label: 'Select Type', fields: [{name: 'HPC'}, {name: 'iHPC'}], validate: true},
              notes: {field: 'notes', label: 'Please explain why you are requesting this service', validate: true}
            },
            catalogId: ''
          },
          {
            id: 'aws_1',
            name: 'AWS',
            displayName: true,
            logo: 'assets/images/aws_ec2.png',
            desc: 'Amazon Elastic Compute Cloud (Amazon EC2) is a web service that provides secure, resizable compute capacity in the cloud',
            requestButton: 'Create Request',
            defaultForm: false,
            help: '',
            form: {
              name: {enable: false},
              notes: {field: 'notes', label: 'Please explain why you are requesting this service', validate: true}
            },
            catalogId: ''
          },
          {
            id: 'storage',
            name: 'eResearch Store',
            displayName: true,
            logo: 'assets/images/storage.jpg',
            desc: 'eResearch Store offers granular access control down to User account level. eResearch fileshares are accessible via the UTS secure network',
            requestButton: 'Create Request',
            defaultForm: true,
            help: '',
            form: {
              name: {enable: true},
              type: {label: 'Select Type', fields: [{name: 'Windows Share'}, {name: 'NFS'}], validate: true},
              notes: {field: 'notes', label: 'Please explain why you are requesting the storage', validate: true}
            },
            catalogId: ''
          }
        ]
      },
    },
    {
      class: "RequestBoxField",
      viewOnly: false,
      definition: {
        name: 'RequestBox',
        boxTitleLabel: 'Request for eResearch Service',
        nameLabel: 'Name',
        typeLabel: 'Type',
        supervisorLabel: 'FNCI / UTS Supervisor',
        backToCatalogLabel: 'Show Catalogue',
        requestLabel: 'submit request',
        notesLabel: 'Add notes to your request',
        requestNamePlaceholder: 'Please name your request',
        dmEmailLabel: 'Data Manager',
        ciEmailLabel: 'FNCI / UTS Supervisor',
        retentionLabel: 'Retention',
        projectStartLabel: 'Start of Project',
        projectEndLabel: 'End of Project',
        valid: {
          name: 'Please name your request',
          notes: 'Please add notes; a description for this request'
        }
      }
    },
    {
      class: "AnchorOrButton",
      viewOnly: false,
      definition: {
        name: "BackToPlan",
        label: 'Back to your Plan',
        value: '/@branding/@portal/record/edit/',
        cssClasses: 'btn btn-large btn-info',
        showPencil: false,
        controlType: 'anchor'
      },
      variableSubstitutionFields: ['value']
    }
  ]
};
