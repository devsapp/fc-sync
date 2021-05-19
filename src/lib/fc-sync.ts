import { ICredentials } from '../common/entity';
const FC = require('@alicloud/fc2');
import * as _ from 'lodash';
import * as path from 'path';
import * as os from 'os';
import * as fse from 'fs-extra';
import * as core from '@serverless-devs/core';
import logger from '../common/logger';

const DEFAULT_CLIENT_TIMEOUT: number = 300;
const DEFAULT_SYNC_CODE_TARGET_DIR: string = path.join(os.homedir(), '.s', 'cache', 'fc-sync', 'code');

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
      securityToken: credentials.stsToken,
      region: this.region,
      timeout: DEFAULT_CLIENT_TIMEOUT * 1000,
    });
  }

  async syncCode(serviceName: string, functionName: string, targetDir?: string): Promise<string> {
    const { data } = await this.fcClient.getFunctionCode(serviceName, functionName);
    const { url } = data;
    const codeZipFileName: string = `${this.credentials.AccountID}_${this.region}_${serviceName}_${functionName}.zip`;
    const codeZipFileTargetDir: string = _.isNil(targetDir) ? DEFAULT_SYNC_CODE_TARGET_DIR : path.resolve(targetDir);
    if (codeZipFileTargetDir === DEFAULT_SYNC_CODE_TARGET_DIR) { 
      await fse.ensureDir(DEFAULT_SYNC_CODE_TARGET_DIR);
    }
    logger.info(`sync code to ${codeZipFileTargetDir}`);
    // 下载 code zip file
    await core.downloadRequest(url, codeZipFileTargetDir, {filename: codeZipFileName, extract: false});
    return path.join(codeZipFileTargetDir, codeZipFileName);
  }
}