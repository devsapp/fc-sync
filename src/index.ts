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
      boolean: ['help', 'code'],
      alias: { 'help': 'h', 'access': 'a', 'region': 'r'},
    };
    const comParse: any = core.commandParse({ args }, apts);
    // 将Args转成Object
    const argsData: any = comParse.data || {};
    const { region, access } = argsData;
    const functionName: string = argsData['function-name'];
    const serviceName: string = argsData['service-name'];
    const triggerName: string = argsData['trigger-name'];
    const targetDir: string = argsData['target-dir']
    const isSyncCode: boolean = argsData.code;
    return {
      region,
      functionName,
      serviceName,
      triggerName,
      isSyncCode,
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

    const region: string = inputs?.props?.region || parsedArgs?.region;
    const functionName: string = inputs?.props?.functionName || parsedArgs?.functionName;
    const serviceName: string = inputs?.props?.serviceName || parsedArgs?.serviceName;
    const { isSyncCode } = parsedArgs;
    const targetDir: string = inputs?.props?.targetDir || parsedArgs?.targetDir;
    const access: string = inputs?.project?.access || parsedArgs?.access;
    const credential: ICredentials = await core.getCredential(access);
    await this.report('fc-sync', 'sync', credential.AccountID, access);
    const fcSync: any = new FcSync(credential, region);
    if (isSyncCode) {
      const codeZipFilePath: string = await fcSync.syncCode(serviceName, functionName, targetDir);
      return codeZipFilePath;
    } else {
      logger.info('not support now.');
    }
  }
}
