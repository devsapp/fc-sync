import _ from 'lodash';
import path from 'path';
import ComponentStarter from '../src/index';
import sinon from 'sinon';
import fse from 'fs-extra';
import FC from '@alicloud/fc2';

const sandbox = sinon.createSandbox();
const componentStarter = new ComponentStarter();

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
  beforeEach(async () => {
    sandbox.stub(FC.prototype, 'getService').resolves({
      data: { name },
    });
    sandbox.stub(FC.prototype, 'listFunctions').resolves({
      data: { functions: [{ name }],
    } });
    sandbox.stub(FC.prototype, 'getFunction').resolves({
      data: { functionName: name },
    });
    sandbox.stub(FC.prototype, 'getFunctionCode').resolves({
      data: { url: 'https://registry.devsapp.cn/simple/devsapp/fc-info/zipball/0.0.11' }
    });
    sandbox.stub(FC.prototype, 'listTriggers').resolves({
      data: { triggers: [{ name }] },
    });
  });

  afterEach(async () => {
    sandbox.restore();
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
