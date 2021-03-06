"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Config {
    constructor(workspaces) {
        this.catalogItems = [];
        const workspaceConfig = workspaces;
        const config = workspaceConfig.catalog;
        this.recordType = config.recordType;
        this.workflowStage = config.workflowStage;
        this.formName = config.formName;
        this.appName = config.appName;
        this.domain = config.domain;
        this.taskURL = config.taskURL;
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
        this.openedById = config.openedById;
        this.assignedToEmail = config.assignedToEmail;
        this.testRequestorId = config.testRequestorId;
        this.defaultGroupId = config.defaultGroupId;
        this.catalogItems = config.items;
        this.types = config.types;
        this.workspaceFileName = config.workspaceFileName;
    }
}
exports.Config = Config;
