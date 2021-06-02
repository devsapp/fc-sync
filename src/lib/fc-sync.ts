import { ICredentials } from '../common/entity';
const FC = require('@alicloud/fc2');
import * as _ from 'lodash';
import * as path from 'path';
import * as fse from 'fs-extra';
import * as core from '@serverless-devs/core';
import logger from '../common/logger';
import WriteFile from './write-file';

const DEFAULT_CLIENT_TIMEOUT: number = 300;
const DEFAULT_SYNC_CODE_TARGET_DIR: string = process.cwd();

const DELETE_SERVICE_KEY = ['serviceName', 'serviceId', 'createdTime', 'lastModifiedTime'];
const DELETE_FUNCTION_KEY = ['lastModifiedTime', 'createdTime', 'codeChecksum', 'codeSize', 'functionName', 'functionId'];

interface ISync {
  region: string;
  serviceName: string;
  functionName?: string;
  targetDir?: string;
  isSyncCode?: boolean;
  isSyncConfig?: boolean;
}

export default class FcSync {
  private fcClient: any;
  private region: string;
  private credentials: ICredentials;

  constructor(credentials: ICredentials, region) {
    if (_.isNil(region)) { throw new Error('please provide region.'); }
    this.region = region;
    this.credentials = credentials;
    this.fcClient = new FC(credentials.AccountID, {
      accessKeyID: credentials.AccessKeyID,
      accessKeySecret: credentials.AccessKeySecret,
      securityToken: credentials.SecurityToken,
      region: this.region,
      timeout: DEFAULT_CLIENT_TIMEOUT * 1000,
    });
  }

  async sync(syncInputs: ISync) {
    logger.debug(`sync inputs is: ${JSON.stringify(syncInputs)}`);
    const {
      serviceName,
      functionName,
      targetDir = DEFAULT_SYNC_CODE_TARGET_DIR,
      isSyncCode,
      isSyncConfig,
    } = syncInputs;

    const serviceConfig = await this.syncService({ serviceName });
    logger.debug(`service config: ${JSON.stringify(serviceConfig)}`);
    const functions = await this.syncFunction({ serviceName, functionName });
    logger.debug(`get functions: ${JSON.stringify(functions)}`);

    const configs = [];
    const codeFiles = {};
    if (_.isEmpty(functions)) {
      configs.push({
        region: this.region,
        service: serviceConfig,
      });
    } else {
      for (const func of functions) {
        const funcName = func.functionName;
  
        if (isSyncCode) {
          codeFiles[funcName] = await this.syncCode(serviceName, funcName, targetDir);
        }
  
        if (isSyncConfig) {
          func.name = funcName;
          func.codeUri = codeFiles[funcName] || '******';
          if (!(func.instanceLifecycleConfig?.preStop?.handler || func.instanceLifecycleConfig?.preStop?.handler)) {
            delete func.instanceLifecycleConfig;
          }
          if (!func.initializer) {
            delete func.initializer;
            delete func.initializationTimeout;
          }
  
          const triggers = await this.asyncTrigger({ serviceName, functionName: funcName });
          logger.debug(`get ${funcName} triggers: ${JSON.stringify(triggers)}`);
  
          configs.push({
            region: this.region,
            service: serviceConfig,
            function: _.pickBy(_.omit(func, DELETE_FUNCTION_KEY), _.identity),
            triggers,
          });
        }
      }
    }

    let configYmlPath;
    if (isSyncConfig) {
      configYmlPath = await WriteFile.writeSYml(targetDir, configs, `${this.region}-${serviceName}`);
    }

    return { configs, codeFiles, configYmlPath };
  }

  async syncService({
    serviceName,
  }) {
    const serviceConfig = (await this.fcClient.getService(serviceName)).data;

    serviceConfig.name = serviceName;
    if (!serviceConfig.logConfig?.project) {
      delete serviceConfig.logConfig;
    }
    if (!serviceConfig.vpcConfig?.vpcId) {
      delete serviceConfig.vpcConfig;
    } else {
      delete serviceConfig.vpcConfig.role;
    }
    if (_.isEmpty(serviceConfig.nasConfig?.mountPoints)) {
      delete serviceConfig.nasConfig;
    }
    if (_.isEmpty(serviceConfig.tracingConfig)) {
      delete serviceConfig.tracingConfig;
    }
    delete serviceConfig.vendorConfig;
    return _.pickBy(_.omit(serviceConfig, DELETE_SERVICE_KEY), _.identity);
  }

  async syncFunction({
    serviceName,
    functionName,
  }) {
    if (functionName) {
      return [(await this.fcClient.getFunction(serviceName, functionName)).data];
    }
    return await this.nextListData('listFunctions', 'functions', [serviceName]);
  }

  async syncCode(serviceName: string, functionName: string, codeZipFileTargetDir: string): Promise<string> {
    const targetDir = path.resolve(codeZipFileTargetDir);
    const { data } = await this.fcClient.getFunctionCode(serviceName, functionName);
    const { url } = data;
    const codeZipFileName: string = `${this.credentials.AccountID}_${this.region}_${serviceName}_${functionName}.zip`;
    await fse.ensureDir(targetDir);
    logger.info(`sync code to ${targetDir}`);
    // 下载 code zip file
    await core.downloadRequest(url, targetDir, { filename: codeZipFileName, extract: false });

    return path.join(targetDir, codeZipFileName);
  }

  async asyncTrigger({
    serviceName,
    functionName,
  }) {
    const triggers = await this.nextListData('listTriggers', 'triggers', [serviceName, functionName]);

    return triggers.map(trigger => ({
      name: trigger.triggerName,
      description: trigger.description,
      sourceArn: trigger.sourceArn || undefined,
      type: trigger.triggerType,
      invocationRole: trigger.invocationRole || undefined,
      qualifier: trigger.qualifier || undefined,
      config: trigger.triggerConfig,
    }));
  }

  async nextListData(method, dataKey, paths) {
    const query: any = {};
    let data = [];
    do {
      const res = (await this.fcClient[method](...paths, query)).data;
      data = data.concat(res[dataKey]);
      query.nextToken = res.nextToken;
    } while(query.nextToken);

    return data;
  }
}