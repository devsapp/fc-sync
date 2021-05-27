import BaseComponent from './common/base';
import logger from './common/logger';
import { InputProps, ICredentials } from './common/entity';
import * as core from '@serverless-devs/core';
import * as _ from 'lodash';
import FcSync from './lib/fc-sync';

export default class FcSyncComponent extends BaseComponent {
  constructor(props) {
    super(props)
  }

  private async report(componentName: string, command: string, accountID?: string, access?: string): Promise<void> {
    let uid: string = accountID;
    if (_.isEmpty(accountID)) {
      const credentials: ICredentials = await core.getCredential(access);
      uid = credentials.AccountID;
    }

    core.reportComponent(componentName, {
      command,
      uid,
    });
  }

  private argsParser(args: string) {
    const apts: any = {
      boolean: ['help'],
      string: ['region', 'service-name', 'function-name', 'trigger-name', 'target-dir', 'type'],
      alias: { 'help': 'h', 'access': 'a', 'region': 'r'},
    };
    const comParse: any = core.commandParse({ args }, apts);
    // 将Args转成Object
    const argsData: any = comParse.data || {};
    const { region, access, type = 'all' } = argsData;
    const functionName: string = argsData['function-name'];
    const serviceName: string = argsData['service-name'];
    const triggerName: string = argsData['trigger-name'];
    const targetDir: string = argsData['target-dir']
    const isSyncCode: boolean = type === 'code' || type === 'all';
    const isSyncConfig: boolean = type === 'config' || type === 'all';

    return {
      region,
      functionName,
      serviceName,
      triggerName,
      isSyncCode,
      isSyncConfig,
      targetDir,
      access
    };
  }

  /**
   * demo 实例
   * @param inputs
   * @returns
   */
  public async sync (inputs: InputProps): Promise<any> {
    const parsedArgs: any = this.argsParser(inputs?.args);
    logger.debug(`parsed args: ${JSON.stringify(parsedArgs)}`);

    const region: string = inputs?.props?.region || parsedArgs?.region;
    const functionName: string = inputs?.props?.functionName || parsedArgs?.functionName;
    const serviceName: string = inputs?.props?.serviceName || parsedArgs?.serviceName;
    const targetDir: string = inputs?.props?.targetDir || parsedArgs?.targetDir;
    const access: string = inputs?.project?.access || parsedArgs?.access;
    const credential: ICredentials = await core.getCredential(access);
    this.report('fc-sync', 'sync', credential.AccountID, access);
    const fcSync: any = new FcSync(credential, region);

    const { isSyncCode, isSyncConfig } = parsedArgs;

    const { codeFiles, configYmlPath } = await fcSync.sync({
      serviceName,
      functionName,
      targetDir,
      isSyncCode,
      isSyncConfig,
    });
    return {
      codeFiles,
      configYmlPath,
    }
  }
}
