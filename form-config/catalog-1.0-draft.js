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
            id: 'omeka',
            name: 'OMEKA',
            displayName: false,
            logo: 'assets/images/omeka.png',
            desc: ' OMEKA is a web publishing platform for institutions interested in connecting digital cultural heritage collections with other resources online.',
            requestButton: 'Create Request',
            defaultForm: true,
            form: {}
          },
          {
            id: 'hpcc',
            name: 'HPCC',
            displayName: false,
            logo: 'assets/images/hpc.png',
            desc: 'The High Performance Computing Cluster can be accessed by UTS researchers via the eResearch HPCC (High Performance Computing Cluster).',
            requestButton: 'Create Request',
            defaultForm: false,
            form: {}
          },
          {
            id: 'ihpc',
            name: 'iHPC',
            displayName: false,
            logo: 'assets/images/ihpc.png',
            desc: 'The iHPC is an interactive high performance computing facility for all researchers within UTS',
            requestButton: 'Create Request',
            defaultForm: false,
            form: {}
          },
          {
            id: 'aws_1',
            name: 'AWS',
            displayName: true,
            logo: 'assets/images/aws_ec2.png',
            desc: 'Amazon Elastic Compute Cloud (Amazon EC2) is a web service that provides secure, resizable compute capacity in the cloud',
            requestButton: 'Create Request',
            defaultForm: false,
            form: {}
          },
          {
            id: 'storage',
            name: 'eResearch Store',
            displayName: true,
            logo: 'assets/images/storage.jpg',
            desc: 'eResearch Store offers granular access control down to User account level. eResearch fileshares are accessible via the UTS secure network',
            requestButton: 'Create Request',
            defaultForm: true,
            form: {}
          },
          {
            id: 'cloudstor',
            name: 'CloudStor',
            displayName: false,
            logo: 'assets/images/cloudstor.png',
            desc: 'Cloudstor is a secure storage and file transfer (FileSender) solution to support collaboration.',
            requestButton: 'Create Request',
            defaultForm: true,
            form: {}
          },
          {
            id: 'limesurvey',
            name: 'LimeSurvey',
            displayName: false,
            logo: 'assets/images/limesurvey.png',
            desc: ' LimeSurvey is a secure Survey platform hosted at UTS. It allows you to develop, publish and collect responses to surveys using a wide range of question types',
            requestButton: 'Create Request',
            defaultForm: true,
            form: {}
          },
          {
            id: 'qualtrics',
            name: 'qualtrics',
            displayName: false,
            logo: 'assets/images/qualtrics.png',
            desc: 'Qualtrics UTS site Survey platform. Create surveys from market research projects to customer experience, product testing, employee experience and brand tracking projects',
            requestButton: 'Create Request',
            defaultForm: true,
            form: {}
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
