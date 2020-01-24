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
        value: 'UTS eResearch Service Catalogue',
        type: 'h2'
      }
    },
    {
      class: 'CatalogDisplayField',
      editOnly: true,
      definition: {
        name: 'CatalogDisplay',
        boxTitleLabel: 'Data Management Plan:',
        requestButton: 'Create Request',
        services: [
          {
            id: 'ihpc',
            name: 'Interactive High Performance Cluster',
            workspaceType: 'iHPC',
            displayName: true,
            logo: 'assets/images/uts_ihpc.png',
            desc: 'The iHPC facility provides an interactive high performance computing resource for all researchers within UTS.',
            requestButton: 'Create Request',
            defaultForm: false,
            help: '',
            workspaceInfo: {
              workspaceTitle: {concat: ['project_name']},
              workspaceDescription: {concat: ['storage_size', 'Project Volume']},
            },
            form: {
              storage_size: {
                validationMsg: 'Project Volume: Add the desired storage size for your project volume',
                title: 'Project Volume Size',
                type: 'text',
                enable: false,
                validate: true,
                requestVariable: 'storage_size'
              },
              project_name: {
                validationMsg: 'Project Short Name: Please add a short name for your project',
                title: 'Project Short Name',
                type: 'text',
                enable: false,
                validate: true,
                requestVariable: 'project_name'
              },
              data_manager: {
                validationMsg: "Data Manager was not added",
                title: 'Data Manager',
                type: 'text',
                prefil: {key: 'dm', val: 'email'},
                disabled: true,
                validate: true,
                requestVariable: 'data_manager'
              },
              data_supervisor: {
                validationMsg: "Please add email of the supervisor",
                title: 'FNCI/UTS Supervisor',
                type: 'text',
                prefil: {key: 'ci', val: 'email'},
                disabled: true,
                validate: true,
                requestVariable: 'data_supervisor'
              },
              data_collaborators: {
                validationMsg: "Contributors: Please add email of the collaborators, UTS ONLY",
                title: 'UTS Contributors',
                type: 'multi-text',
                prefil: [
                  {key: 'contributors', val: 'email'},
                  {key: 'contributor_supervisors', val: 'email'}
                ],
                requestVariable: 'data_collaborators'
              },
              retention_period: {
                validationMsg: "Add the retention period",
                title: 'Retention Period',
                type: 'text',
                prefil: {key: 'retention', val: ''},
                requestVariable: 'retention_period'
              },
              end_of_project: {
                validationMsg: "Add End of project date",
                title: 'End of Project',
                type: 'text',
                prefil: {key: 'projectEnd', val: ''},
                requestVariable: 'end_of_project'
              },
              notes: {
                validationMsg: "Notes: Add notes for your request",
                title: 'Comments/Notes/Software to Use in cluster',
                field: 'notes',
                type: 'textarea',
                textarea: {rows: 10, cols: 150, maxlength: 30},
                requestVariable: 'notes'
              }
            }
          },
          {
            id: 'hpcc',
            name: 'High Performance Computing Cluster',
            workspaceType: 'HPCC',
            displayName: true,
            logo: 'assets/images/uts_hpcc.png',
            desc: 'High Performance Computing Cluster (HPCC) that can be accessed by UTS researchers.',
            requestButton: 'Create Request',
            defaultForm: false,
            help: '',
            workspaceInfo: {
              workspaceTitle: {concat: ['project_name']},
              workspaceDescription: {concat: ['storage_size', 'Share']},
            },
            form: {
              storage_size: {
                validationMsg: 'Project Size: Add the desired storage size for your project',
                title: 'Storage Size',
                type: 'text',
                enable: false,
                validate: true,
                requestVariable: 'storage_size'
              },
              project_name: {
                validationMsg: 'Project Short Name: Please add a short name for your project',
                title: 'Project Short Name',
                type: 'text',
                enable: false,
                validate: true,
                requestVariable: 'project_name'
              },
              data_manager: {
                validationMsg: "Data Manager was not added",
                title: 'Data Manager',
                type: 'text',
                prefil: {key: 'dm', val: 'email'},
                disabled: true,
                validate: true,
                requestVariable: 'data_manager'
              },
              data_supervisor: {
                validationMsg: "Please add email of the supervisor",
                title: 'FNCI/UTS Supervisor',
                type: 'text',
                prefil: {key: 'ci', val: 'email'},
                disabled: true,
                validate: true,
                requestVariable: 'data_supervisor'
              },
              data_collaborators: {
                validationMsg: "Contributors: Please add email of the collaborators, UTS ONLY",
                title: 'UTS Contributors',
                type: 'multi-text',
                prefil: [
                  {key: 'contributors', val: 'email'},
                  {key: 'contributor_supervisors', val: 'email'}
                ],
                requestVariable: 'data_collaborators'
              },
              retention_period: {
                validationMsg: "Add the retention period",
                title: 'Retention Period',
                type: 'text',
                prefil: {key: 'retention', val: ''},
                requestVariable: 'retention_period'
              },
              end_of_project: {
                validationMsg: "Add End of project date",
                title: 'End of Project',
                type: 'text',
                prefil: {key: 'projectEnd', val: ''},
                requestVariable: 'end_of_project'
              },
              notes: {
                validationMsg: "Software: What software would you use?",
                title: 'Desired software to use in cluster',
                field: 'notes',
                type: 'textarea',
                textarea: {rows: 10, cols: 150, maxlength: 30},
                requestVariable: 'notes'
              }
            }
          },
          {
            id: 'storage',
            name: 'eResearch Store',
            workspaceType: 'Isilon Storage',
            displayName: true,
            logo: 'assets/images/storage.png',
            desc: 'eResearch Store offers granular access control down to User account level. eResearch fileshares are accessible via the UTS secure network',
            defaultForm: true,
            requestButton: 'Create Request',
            help: '',
            workspaceInfo: {
              workspaceTitle: {concat: ['share_name']},
              workspaceDescription: {concat: ['share_type', 'storage_size']},
            },
            form: {
              storage_size: {
                validationMsg: "Storage Size: Add the desired storage size",
                title: 'Size of Storage (If unsure, please leave blank)',
                type: 'text',
                requestVariable: 'storage_size'
              },
              share_name: {
                validationMsg: "Add a share name",
                title: 'Add a share name',
                type: 'text',
                validate: true,
                requestVariable: 'share_name'
              },
              share_type: {
                validationMsg: "Select the type of share",
                title: 'Select a type of share',
                fields: [{name: 'SMB Share (Windows/Mac/Linux)'}, {name: 'NFS Share (Mac/Linux)'}],
                validate: true,
                type: 'select',
                typeLabel: 'Select a Type',
                requestVariable: 'share_type'
              },
              access_offsite: {
                validationMsg: 'Select if you need access off site',
                title: 'Access share off site?',
                fields: [{name: 'yes'}, {name: 'no'}],
                validate: true,
                type: 'radio',
                requestVariable: 'access_offsite'
              },
              data_manager: {
                validationMsg: "Data Manager was not added",
                title: 'Data Manager',
                type: 'text',
                validate: true,
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
                validate: true,
                requestVariable: 'data_supervisor'
              },
              data_collaborators: {
                validationMsg: "Collaborators: Please add email of the collaborators",
                title: 'Collaborators',
                type: 'multi-text',
                prefil: [
                  {key: 'contributors', val: 'email'},
                  {key: 'contributor_supervisors', val: 'email'}
                ],
                requestVariable: 'data_collaborators'
              },
              retention_period: {
                validationMsg: "Add the retention period",
                title: 'Retention Period',
                type: 'text',
                prefil: {key: 'retention', val: ''},
                requestVariable: 'retention_period'
              },
              end_of_project: {
                validationMsg: "Add End of project date",
                title: 'End of Project',
                type: 'text',
                prefil: {key: 'projectEnd', val: ''},
                requestVariable: 'end_of_project'
              },
              notes: {
                validationMsg: "Add notes for your request",
                title: 'Notes / Comments',
                field: 'notes',
                type: 'textarea',
                textarea: {rows: 10, cols: 150, maxlength: 30},
                requestVariable: 'notes'
              }
            }
          },
          {
            id: 'stash_rdmp_help',
            name: 'Stash Research Data Management Consultation',
            workspaceType: 'Data Management',
            displayName: true,
            logo: 'assets/images/catalog.png',
            desc: 'Having trouble completing your RDMP? Just enter "?" in any fields you are unsure',
            defaultForm: true,
            requestButton: 'Create Request',
            help: '',
            workspaceInfo: {
              workspaceTitle: {name: 'request'},
              workspaceDescription: {name: 'Consultation'}
            },
            form: {
              reasons_for_consultation: {
                validationMsg: 'Select reasons for consultation',
                title: 'Reasons for consultation',
                fields: [{name: 'My research involves human subjects'}, {name: 'Other reasons (explain in notes)'}],
                validate: true,
                type: 'radio',
                requestVariable: 'reasons_for_consultation'
              },
              notes: {
                validationMsg: "Add notes for your request",
                title: 'Notes',
                field: 'notes',
                type: 'textarea',
                validate: true,
                textarea: {rows: 10, cols: 150, maxlength: 30},
                requestVariable: 'notes'
              },
              type_of_user: {
                validationMsg: "Select if you are an HDR or a researcher",
                title: 'Are you a high degree research student?',
                validate: true,
                type: 'checkbox',
                prefil: {key: 'projectHdr', val: ''},
                fields: [{name: 'HDR'}],
                requestVariable: 'type_of_user'
              },
              data_manager: {
                validationMsg: "Data Manager was not added",
                title: 'Data Manager',
                type: 'text',
                prefil: {key: 'dm', val: 'email'},
                disabled: true,
                validate: true,
                requestVariable: 'data_manager'
              },
              data_supervisor: {
                validationMsg: "Please add email of the supervisor",
                title: 'FNCI/UTS Supervisor',
                type: 'text',
                prefil: {key: 'ci', val: 'email'},
                disabled: true,
                validate: true,
                requestVariable: 'data_supervisor'
              },
              days_help: {
                validationMsg: "Add days usually best suit you",
                title: 'Which days usually best suit you',
                type: 'checkbox',
                fields: [{name: 'Mon'}, {name: 'Tues'}, {name: 'Wed'}, {name: 'Thurs'}],
                requestVariable: 'days_help'
              },
            }
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
        backToCatalogLabel: 'Show Catalogue',
        requestLabel: 'Submit Request',
        requestSuccess: 'Success!',
        requestNextAction: 'There is now a ticket/job in Service Connect.',
        errorRequest: 'There were some errors while submitting your request',
        warning: 'Warning!',
        requestingMessage: '... Creating request, please wait ...',
        warningRequest: 'This form is pre-filled with information from your data management plan. If the fields are incorrect, please modify your plan.'
      }
    },
    {
      class: 'Container',
      compClass: 'TextBlockComponent',
      viewOnly: false,
      definition: {
        name: 'cataloghelp',
        value: 'If your service is not listed or you are having issues with this catalogue; please email eresearch-it@uts.edu.au',
        type: 'p',
        cssClasses: ''
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
