import BaseComponent from './common/base';
import logger from './common/logger';
import { InputProps, ICredentials } from './common/entity';
import * as core from '@serverless-devs/core';
import * as _ from 'lodash';
import FcSync from './lib/fc-sync';
import help from './lib/help';

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
      boolean: ['help', 'force'],
      string: ['region', 'service-name', 'function-name', 'target-dir', 'type'],
      alias: { 'help': 'h', 'access': 'a', 'force': 'f' },
    };
    const comParse: any = core.commandParse({ args }, apts);
    // 将Args转成Object
    const argsData: any = comParse.data || {};
    const { region, access, type = 'all', force } = argsData;
    if (argsData.help) {
      return { isHelp: true };
    }
    const functionName: string = argsData['function-name'];
    const serviceName: string = argsData['service-name'];
    const targetDir: string = argsData['target-dir']
    const isSyncCode: boolean = type === 'code' || type === 'all';
    const isSyncConfig: boolean = type === 'config' || type === 'all';

    return {
      force,
      region,
      serviceName,
      functionName,
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
    if (parsedArgs.isHelp) {
      core.help(help);
      return;
    }

    const access: string = inputs?.project?.access || parsedArgs?.access;
    const credential: ICredentials = await core.getCredential(access);
    this.report('fc-sync', 'sync', credential.AccountID, access);

    if (!(parsedArgs.region && parsedArgs.serviceName)) {
      parsedArgs.region = inputs?.props?.region;
      parsedArgs.serviceName = inputs?.props?.serviceName;
      parsedArgs.functionName = inputs?.props?.functionName;
      parsedArgs.targetDir = inputs?.props?.targetDir || parsedArgs?.targetDir;
    }

    if (!(parsedArgs.region && parsedArgs.serviceName)) {
      throw new Error('region/service-name required.');
    }

    const fcSync: any = new FcSync(credential, parsedArgs.region);

    const { codeFiles, configYmlPath } = await fcSync.sync(parsedArgs, { force: parsedArgs.force });
    return {
      codeFiles,
      configYmlPath,
    }
  }
}
