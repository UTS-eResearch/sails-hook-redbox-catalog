"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Config {
    constructor(workspaces) {
        const workspaceConfig = workspaces;
        const StorageConfig = workspaceConfig.catalog;
        this.recordType = StorageConfig.recordType;
        this.workflowStage = StorageConfig.workflowStage;
        this.formName = StorageConfig.formName;
        this.appName = StorageConfig.appName;
        this.domain = StorageConfig.domain;
        this.parentRecord = workspaceConfig.parentRecord;
        this.provisionerUser = workspaceConfig.provisionerUser;
        this.serverId = StorageConfig.serverId;
        this.appId = StorageConfig.appId;
        this.brandingAndPortalUrl = '';
        this.redboxHeaders = {
            'Cache-Control': 'no-cache',
            'Content-Type': 'application/json',
            'Authorization': workspaceConfig.portal.authorization,
        };
        this.defaultGroupId = StorageConfig.defaultGroupId;
        this.types = StorageConfig.types;
        this.workspaceFileName = StorageConfig.workspaceFileName;
    }
}
exports.Config = Config;
