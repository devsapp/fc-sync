import _ from 'lodash';
import path from 'path';
import ComponentStarter from '../src/index';
import fse from 'fs-extra';
import FC from '@alicloud/fc2';

const name = 'fc-sync-test';
const dir = './test/testSync/';
const inputs = {
  props: {
    region: 'cn-shenzhen',
    serviceName: name,
    functionName: name,
  },
  credentials: {
    AccountID: 'AccountID',
    AccessKeyID: 'AccessKeyID',
    AccessKeySecret: 'AccessKeySecret',
  },
  appName: 'fc-sync-test',
  project: {
    component: 'devsapp/fc-sync',
    access: 'test',
    projectName: 'test',
  },
  command: '',
  args: '--region',
  path: {
    configPath: path.join(process.cwd(), '..', 'example', 's.yaml'),
  },
};

describe('test/index.test.ts', () => {
  let componentStarter;
  beforeEach(async () => {
    const fcClient = new FC(inputs.credentials.AccountID, {
      accessKeyID: inputs.credentials.AccessKeyID,
      accessKeySecret: inputs.credentials.AccessKeySecret,
      region: inputs.props.region,
    });
    fcClient.getService = () => ({ data: { name } });
    fcClient.listFunctions = () => ({ data: { functions: [{ name }], } });
    fcClient.getFunction = () => ({
      data: { functionName: name, 
        handler: 'index.handler',
        memorySize: 128, }
    });
    fcClient.getFunctionCode = () => ({ data: { url: 'https://registry.devsapp.cn/simple/devsapp/fc-info/zipball/0.0.11' } });
    fcClient.listTriggers = () => ({ data: { triggers: [{ name }] }, });
    fcClient.getFunctionAsyncConfig = () => ({});

    componentStarter = new ComponentStarter();
    componentStarter.getFcClient = jest.fn();
    componentStarter.getFcClient.mockReturnValue(fcClient);
  })

  afterEach(async () => {
    await fse.remove(dir);
  });

  it('sync help', async () => {
    const inp = _.cloneDeep(inputs);
    inp.args = '--help';
    const result = await componentStarter.sync(inp);
    expect(result).toBeUndefined();
  });

  it('sync yaml', async () => {
    const inp = _.cloneDeep(inputs);
    inp.args = `--target-dir ${dir}`;
    const result = await componentStarter.sync(inp);
    expect(result.codeFiles['fc-sync-test']).toMatch(/AccountID_cn-shenzhen_fc-sync-test_fc-sync-test$/);
  });
});
