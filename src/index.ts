import logger from './common/logger';
import { InputProps } from './common/entity';
import * as core from '@serverless-devs/core';
import * as _ from 'lodash';
import FcSync from './lib/fc-sync';
import WriteFile from './lib/write-file';
import help from './lib/help';

export default class FcSyncComponent {
  /**
   * demo 实例
   * @param inputs
   * @returns
   */
  async sync(inputs: InputProps): Promise<any> {
    const parsedArgs: any = this.argsParser(inputs);
    logger.debug(`parsed args: ${JSON.stringify(parsedArgs)}`);
    if (parsedArgs.isHelp) {
      core.help(help);
      return;
    }

    const access: string = inputs?.project?.access || parsedArgs?.access;
    WriteFile.access = access;

    if (!(parsedArgs.region && parsedArgs.serviceName)) {
      parsedArgs.region = inputs?.props?.region;
      parsedArgs.serviceName = inputs?.props?.serviceName;
      parsedArgs.functionName = inputs?.props?.functionName;
      parsedArgs.targetDir = inputs?.props?.targetDir || parsedArgs?.targetDir;
    }

    if (!(parsedArgs.region && parsedArgs.serviceName)) {
      throw new Error('region/service-name required.');
    }
    const fcClient = await this.getFcClient(inputs, parsedArgs.region);
    this.report('fc-sync', 'sync', fcClient.accountid);

    const fcSync: any = new FcSync(fcClient, parsedArgs.region);
    const { codeFiles, configYmlPath } = await fcSync.sync(parsedArgs, { force: parsedArgs.force });
    return {
      codeFiles,
      configYmlPath,
    };
  }

  private async getFcClient(inputs, region): Promise<any> {
    if (_.isEmpty(inputs.props)) {
      // eslint-disable-next-line no-param-reassign
      inputs.props = {};
    }
    if (_.isEmpty(inputs.props.region)) {
      // eslint-disable-next-line no-param-reassign
      inputs.props.region = region;
    }
    const fcCommon = await core.loadComponent('devsapp/fc-common');
    return fcCommon.makeFcClient(inputs);
  }

  private async report(componentName: string, command: string, uid?: string): Promise<void> {
    core.reportComponent(componentName, {
      command,
      uid,
    });
  }

  private argsParser(inputs: InputProps) {
    const apts: any = {
      boolean: ['help', 'force'],
      string: ['region', 'service-name', 'function-name', 'target-dir', 'type'],
      alias: { help: 'h', access: 'a', force: 'f' },
    };
    const comParse: any = core.commandParse(inputs, apts);
    // 将Args转成Object
    const argsData: any = comParse.data || {};
    const { region, access, type = 'all', force } = argsData;
    if (argsData.help) {
      return { isHelp: true };
    }
    const functionName: string = argsData['function-name'];
    const serviceName: string = argsData['service-name'];
    const targetDir: string = argsData['target-dir'];
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
      access,
    };
  }
}
