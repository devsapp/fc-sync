import * as _ from 'lodash';
import * as path from 'path';
import * as fse from 'fs-extra';
import * as core from '@serverless-devs/core';
import logger from '../common/logger';
import WriteFile from './write-file';
import { checkDirExists } from './utils';

const DEFAULT_SYNC_CODE_TARGET_DIR: string = process.cwd();

const DELETE_SERVICE_KEY = ['serviceName', 'serviceId', 'createdTime', 'lastModifiedTime'];
const DELETE_FUNCTION_KEY = ['lastModifiedTime', 'createdTime', 'codeChecksum', 'codeSize', 'functionName', 'functionId'];
const isCustomContainer = (runtime) => runtime === 'custom-container';

interface ISync {
  region: string;
  serviceName: string;
  functionName?: string;
  targetDir?: string;
  isSyncCode?: boolean;
  isSyncConfig?: boolean;
  qualifier?: string;
}

export default class FcSync {
  private fcClient: any;
  private region: string;

  constructor(fcClient, region: string) {
    if (_.isNil(region)) { throw new Error('please provide region.'); }
    this.region = region;
    this.fcClient = fcClient;
  }

  async sync(syncInputs: ISync, { force }) {
    logger.debug(`sync inputs is: ${JSON.stringify(syncInputs)}`);
    const {
      serviceName,
      functionName,
      targetDir = DEFAULT_SYNC_CODE_TARGET_DIR,
      isSyncCode,
      isSyncConfig,
      qualifier,
    } = syncInputs;

    const serviceConfig = await this.syncService({ serviceName, qualifier });
    logger.debug(`service config: ${JSON.stringify(serviceConfig)}`);
    const functions = await this.syncFunction({ serviceName, functionName, qualifier });
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
          if (isCustomContainer(func.runtime)) {
            logger.warning(`Reminder sync code: ${serviceName}/${funcName} runtime is custom-container, skip`);
          } else {
            codeFiles[funcName] = await this.syncCode(serviceName, funcName, targetDir, force, qualifier);
          }
        }

        if (isSyncConfig) {
          func.name = funcName;
          if (!(func.instanceLifecycleConfig?.preStop?.handler || func.instanceLifecycleConfig?.preStop?.handler)) {
            delete func.instanceLifecycleConfig;
          }
          if (!func.initializer) {
            delete func.initializer;
            delete func.initializationTimeout;
          }
          if (func.instanceType !== 'g1') {
            delete func.gpuMemorySize;
          }
          if (_.isNil(func.customDNS)) {
            delete func.customDNS;
          }

          func.asyncConfiguration = await this.getFunctionAsyncConfig({ serviceName, functionName: funcName, qualifier });
          const triggers = await this.asyncTrigger({ serviceName, functionName: funcName });
          logger.debug(`get ${funcName} triggers: ${JSON.stringify(triggers)}`);

          const config: any = {
            region: this.region,
            service: serviceConfig,
          };

          const funcConfig = this.clearInvalidField(func, DELETE_FUNCTION_KEY);
          if (isCustomContainer(funcConfig?.runtime)) {
            if (_.has(funcConfig.customContainerConfig, 'accelerationInfo')) {
              delete funcConfig.customContainerConfig.accelerationInfo;
            }
            const customContainerConfig = {};
            _.forIn(funcConfig.customContainerConfig, (value, key) => {
              if (!_.isEmpty(value)) {
                customContainerConfig[key] = value;
              }
            });
            funcConfig.customContainerConfig = customContainerConfig;
          } else {
            funcConfig.codeUri = codeFiles[funcName] || '******';
          }
          if (!_.isEmpty(funcConfig)) {
            config.function = funcConfig;
          }
          if (!_.isEmpty(triggers)) {
            config.triggers = triggers;
          }
          configs.push(config);
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
    qualifier,
  }) {
    const serviceConfig = (await this.fcClient.getService(serviceName, undefined, qualifier)).data;

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

    return this.clearInvalidField(serviceConfig, DELETE_SERVICE_KEY);
  }

  async syncFunction({
    serviceName,
    functionName,
    qualifier,
  }) {
    if (functionName) {
      return [(await this.fcClient.getFunction(serviceName, functionName, undefined, qualifier)).data];
    }
    return await this.nextListData('listFunctions', 'functions', [serviceName], qualifier, undefined);
  }

  async getFunctionAsyncConfig({ serviceName, functionName, qualifier }) {
    try {
      const { data } = await this.fcClient.getFunctionAsyncConfig(serviceName, functionName, qualifier);

      const {
        statefulInvocation,
        maxAsyncRetryAttempts,
        maxAsyncEventAgeInSeconds,
        destinationConfig = {},
      } = data || {};
      const onSuccess = destinationConfig?.onSuccess?.destination;
      const onFailure = destinationConfig?.onFailure?.destination;

      const functionAsyncConfig: any = {};
      // 如果返回值不为空，则追加到 functionAsyncConfig 配置中
      if (!(_.isNil(onSuccess) && _.isNil(onFailure))) {
        functionAsyncConfig.destination = {};
        if (!_.isNil(onSuccess)) {
          functionAsyncConfig.destination.onSuccess = onSuccess;
        }
        if (!_.isNil(onFailure)) {
          functionAsyncConfig.destination.onFailure = onFailure;
        }
      }
      if (!_.isNil(maxAsyncEventAgeInSeconds)) {
        functionAsyncConfig.maxAsyncEventAgeInSeconds = maxAsyncEventAgeInSeconds;
      }
      if (!_.isNil(maxAsyncRetryAttempts)) {
        functionAsyncConfig.maxAsyncRetryAttempts = maxAsyncRetryAttempts;
      }
      if (!_.isNil(statefulInvocation)) {
        functionAsyncConfig.statefulInvocation = statefulInvocation;
      }

      // 如果 functionAsyncConfig 不为空，则返回配置；否则返回 undefined
      if (!_.isEmpty(functionAsyncConfig)) {
        return functionAsyncConfig;
      }
    } catch (ex) {
      if (ex.code !== 'AsyncConfigNotExists') {
        throw ex;
      }
    }
  }

  async syncCode(serviceName: string, functionName: string, codeZipFileTargetDir: string, force: boolean, qualifier: string): Promise<string> {
    const targetDir = path.resolve(codeZipFileTargetDir);
    const codeDir = path.join(targetDir, `${this.fcClient.accountid}_${this.region}_${serviceName}_${functionName}`);

    if (checkDirExists(codeDir)) {
      if (!force) {
        throw new Error(`The folder ${codeDir} already exists, please specify -f/--force if it is forcibly overwritten.`);
      }
    } else {
      await fse.ensureDir(codeDir);
    }

    const { data } = await this.fcClient.getFunctionCode(serviceName, functionName, undefined, qualifier);
    const { url } = data;
    const codeZipFileName = `${this.fcClient.accountid}_${this.region}_${serviceName}_${functionName}.zip`;

    logger.info(`sync code to ${codeDir}`);

    // 下载 code zip file
    await core.downloadRequest(url, codeDir, { filename: codeZipFileName, extract: true });

    // const zipFileUri = path.join(codeDir, codeZipFileName);
    // await core.unzip(zipFileUri, codeDir);
    // await fse.remove(zipFileUri);
    return codeDir;
  }

  async asyncTrigger({
    serviceName,
    functionName,
  }) {
    const triggers = await this.nextListData('listTriggers', 'triggers', [serviceName, functionName], undefined, {
      'x-fc-enable-eventbridge-trigger': 'enable',
    });

    return triggers.map((trigger) => {
      if (trigger.triggerType === 'eventbridge') {
        const eventSourceType = trigger.triggerConfig.eventSourceConfig?.eventSourceType;
        const deleteKeys = {
          RocketMQ: ['sourceMNSParameters', 'sourceRabbitMQParameters', 'sourceKafkaParameters'],
          Default: ['eventSourceConfig'],
          MNS: ['sourceRabbitMQParameters', 'sourceKafkaParameters', 'sourceRocketMQParameters'],
          RabbitMQ: ['sourceMNSParameters', 'sourceKafkaParameters', 'sourceRocketMQParameters'],
          Kafka: ['sourceMNSParameters', 'sourceRabbitMQParameters', 'sourceRocketMQParameters'],
        };

        const needDeleteKeys = deleteKeys[eventSourceType];
        if (needDeleteKeys) {
          for (const needDeleteKey of needDeleteKeys) {
            delete trigger.triggerConfig.eventSourceConfig?.eventSourceParameters?.[needDeleteKey];
          }
        }
      }
      return {
        name: trigger.triggerName,
        description: trigger.description,
        sourceArn: trigger.sourceArn || undefined,
        type: trigger.triggerType,
        role: trigger.invocationRole || undefined,
        qualifier: trigger.qualifier || undefined,
        config: trigger.triggerConfig,
      };
    });
  }

  async nextListData(method, dataKey, paths, qualifier, headers) {
    const query: any = {};
    let data = [];
    do {
      const res = (await this.fcClient[method](...paths, query, headers, qualifier)).data;
      data = data.concat(res[dataKey]);
      query.nextToken = res.nextToken;
    } while (query.nextToken);

    return data;
  }

  private clearInvalidField(data, invalidKeys) {
    const d = _.omit(data, invalidKeys);
    return _.pickBy(d, (value: any) => !_.isNil(value) && value !== '');
  }
}
