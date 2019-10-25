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
              short_name: {
                validationMsg: 'Short Name: Please add a short name for your project',
                title: 'Short Name',
                type: 'text',
                enable: false,
                requestVariable: 'project_name'
              },
              cluster_type: {
                validationMsg: "Cluster Type: Select the type of cluster",
                title: 'Select a type of cluster',
                fields: [{name: 'HPC'}, {name: 'iHPC'}],
                validate: true,
                type: 'select',
                requestVariable: 'cluster_type'
              },
              notes: {
                validationMsg: "Notes: Add notes for your request",
                title: 'Notes',
                field: 'notes',
                type: 'textarea',
                textarea: {rows: 10, cols: 150, maxlength: 30},
                validate: true,
                requestVariable: 'notes'
              }
            },
            catalogId: 'deab4dd74ffe170014ded0311310c783'
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
              name: {
                validationMsg: "Name: Add a short name for your aws instance",
                title: 'Short Name',
                type: 'text'
              },
              notes: {
                validationMsg: "Cluster Type: Select the type of cluster",
                desc: "Add notes for your request",
                title: 'Notes',
                field: 'notes',
                type: 'textarea',
                textarea: {rows: 10, cols: 150, maxlength: 30},
                validate: true
              }
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
              storage_size: {
                validationMsg: "Storage Size: Add the desired storage size",
                title: 'Size of Storage',
                type: 'text',
                requestVariable: 'storage_size'
              },
              share_name: {
                validationMsg: "Short Name",
                title: 'Short Name',
                type: 'text',
                requestVariable: 'share_name'
              },
              share_type: {
                validationMsg: "Select the type of share",
                title: 'Select a type of share',
                fields: [{name: 'SMB Share (Windows/Mac/Linux)'}, {name: 'NFS Share (Mac/Linux)'}],
                validate: true,
                type: 'select',
                requestVariable: 'share_type'
              },
              data_manager: {
                validationMsg: "Data Manager was not added",
                title: 'Data Manager',
                type: 'text',
                prefil: {key: 'dm', val: 'email'},
                disabled: true,
                requestVariable: 'data_manager'
              },
              data_supervisor: {
                validationMsg: "Please add email of the supervisor",
                title: 'FNCI/UTS Supervisor',
                type: 'text',
                prefil: {key: 'ci', val: 'email'},
                disabled: true,
                requestVariable: 'data_supervisor'
              },
              data_colaborators: {
                validationMsg: "Collaborators: Please add email of the collaborators",
                title: 'Collaborators',
                type: 'text',
                requestVariable: 'data_colaborators'
              },
              retention_period: {
                validationMsg: "Add the retention period",
                title: 'Retention Period',
                type: 'text',
                prefil: {key: 'retention'},
                requestVariable: 'retention_period'
              },
              end_of_project: {
                validationMsg: "Add End of project date",
                title: 'End of Project',
                type: 'text',
                requestVariable: 'end_of_project'
              },
              notes: {
                validationMsg: "Add notes for your request",
                title: 'Notes',
                field: 'notes',
                validate: true,
                type: 'textarea',
                textarea: {rows: 10, cols: 150, maxlength: 30},
                requestVariable: 'notes'
              }
            },
            catalogId: 'bfe2797edb24805079ca773c349619d0'
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
