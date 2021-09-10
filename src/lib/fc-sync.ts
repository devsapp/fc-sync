import { ICredentials } from '../common/entity';
import FC from '@alicloud/fc2';
import * as _ from 'lodash';
import * as path from 'path';
import * as fse from 'fs-extra';
import * as core from '@serverless-devs/core';
import logger from '../common/logger';
import WriteFile from './write-file';
import { checkDirExists } from './utils';

const DEFAULT_CLIENT_TIMEOUT = 300;
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

  constructor(credentials: ICredentials, region: string, endpoint: string) {
    if (_.isNil(region)) { throw new Error('please provide region.'); }
    this.region = region;
    this.credentials = credentials;
    this.fcClient = new FC(credentials.AccountID, {
      region,
      endpoint,
      accessKeyID: credentials.AccessKeyID,
      accessKeySecret: credentials.AccessKeySecret,
      securityToken: credentials.SecurityToken,
      timeout: DEFAULT_CLIENT_TIMEOUT * 1000,
    });
  }

  async sync(syncInputs: ISync, { force }) {
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
          if (func.runtime === 'custom-container') {
            logger.warning(`Reminder sync code: ${serviceName}/${funcName} runtime is custom-container, skip`);
          } else {
            codeFiles[funcName] = await this.syncCode(serviceName, funcName, targetDir, force);
          }
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

          func.asyncConfiguration = await this.getFunctionAsyncConfig({ serviceName, functionName: funcName });
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
      logger.log(`You can deploy the latest configuration of your sync through the [s exec -t ${configYmlPath} -- sync] command.`, 'blue');
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
      serviceConfig.vpcConfig.vswitchIds = serviceConfig.vpcConfig.vSwitchIds;
      delete serviceConfig.vpcConfig.role;
      delete serviceConfig.vpcConfig.vSwitchIds;
    }
    if (_.isEmpty(serviceConfig.nasConfig?.mountPoints)) {
      delete serviceConfig.nasConfig;
    } else {
      const { userId, groupId, mountPoints } = serviceConfig.nasConfig;

      serviceConfig.nasConfig = {
        userId,
        groupId,
        mountPoints: mountPoints?.map((item) => {
          const [serverAddr, nasDir] = item.serverAddr.split(':');
          return { serverAddr, nasDir, fcDir: item.mountDir };
        }),
      };
    }
    if (serviceConfig.tracingConfig?.type) {
      serviceConfig.tracingConfig = 'Enable';
    } else {
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

  async getFunctionAsyncConfig({ serviceName, functionName }) {
    try {
      const { data } = await this.fcClient.getFunctionAsyncConfig(serviceName, functionName);
      return {
        destination: {
          onSuccess: data?.destinationConfig?.onSuccess.destination,
          onFailure: data?.destinationConfig?.onFailure.destination,
        },
        maxAsyncEventAgeInSeconds: data?.maxAsyncEventAgeInSeconds,
        maxAsyncRetryAttempts: data?.maxAsyncRetryAttempts,
        statefulInvocation: data?.statefulInvocation,
      };
    } catch (ex) {
      if (ex.code !== 'AsyncConfigNotExists') {
        throw ex;
      }
    }
  }

  async syncCode(serviceName: string, functionName: string, codeZipFileTargetDir: string, force: boolean): Promise<string> {
    const targetDir = path.resolve(codeZipFileTargetDir);
    const codeDir = path.join(targetDir, `${this.credentials.AccountID}_${this.region}_${serviceName}_${functionName}`);

    if (checkDirExists(codeDir)) {
      if (!force) {
        throw new Error(`The folder ${codeDir} already exists, please specify -f/--force if it is forcibly overwritten.`);
      }
    } else {
      await fse.ensureDir(codeDir);
    }

    const { data } = await this.fcClient.getFunctionCode(serviceName, functionName);
    const { url } = data;
    const codeZipFileName = `${this.credentials.AccountID}_${this.region}_${serviceName}_${functionName}.zip`;

    logger.info(`sync code to ${codeDir}`);

    // 下载 code zip file
    await core.downloadRequest(url, codeDir, { filename: codeZipFileName, extract: false });

    const zipFileUri = path.join(codeDir, codeZipFileName);
    await core.unzip(zipFileUri, codeDir);
    await fse.remove(zipFileUri);
    return codeDir;
  }

  async asyncTrigger({
    serviceName,
    functionName,
  }) {
    const triggers = await this.nextListData('listTriggers', 'triggers', [serviceName, functionName]);

    return triggers.map((trigger) => ({
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
    } while (query.nextToken);

    return data;
  }
}
