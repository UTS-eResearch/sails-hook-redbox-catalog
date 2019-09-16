export class Config {
  recordType: string;
  formName: string;
  workflowStage: string;
  appId: string;
  serverId: string;
  appName: string;
  parentRecord: string;
  provisionerUser: string;
  brandingAndPortalUrl: string;
  redboxHeaders: any;
  servicenowHeaders: any;
  domain: string;
  requestTable: string;
  user: string;
  password: string;
  defaultGroupId: number;
  types: any;
  workspaceFileName: string;
  requesteeId: string;
  requesteeEmail: string;
  testRequestorId: string;

  constructor(workspaces) {
    const workspaceConfig = workspaces;
    const config = workspaceConfig.catalog;

    this.recordType = config.recordType;
    this.workflowStage = config.workflowStage;
    this.formName = config.formName;
    this.appName = config.appName;
    this.domain = config.domain;
    this.requestTable = config.requestTable;
    this.user = config.user;
    this.password = config.password;
    this.parentRecord = workspaceConfig.parentRecord;
    this.provisionerUser = workspaceConfig.provisionerUser;
    this.serverId = config.serverId;
    this.appId = config.appId;
    this.brandingAndPortalUrl = '';
    this.redboxHeaders = {
      'Cache-Control': 'no-cache',
      'Content-Type': 'application/json',
      'Authorization': workspaceConfig.portal.authorization,
    };
    this.servicenowHeaders = {
      'Cache-Control': 'no-cache',
      'Content-Type': 'application/json',
      'Authorization': 'Basic ' + Buffer.from(this.user + ':' + this.password).toString('base64')
    };
    this.requesteeId = config.requesteeId;
    this.requesteeEmail = config.requesteeEmail;
    this.testRequestorId = config.testRequestorId;
    this.defaultGroupId = config.defaultGroupId;

    this.types = config.types;
    this.workspaceFileName = config.workspaceFileName;
  }
}
