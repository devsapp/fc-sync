import _ from 'lodash';
import FC from '@alicloud/fc2';
import path from 'path';
import dotenv from 'dotenv';
import fse from 'fs-extra';
import yaml from 'js-yaml';
import { exec } from 'child_process';
import ComponentStarter from '../src/index';

function getYamlData(yamlPath) {
  return JSON.parse(JSON.stringify(yaml.load(fse.readFileSync(yamlPath))))
}

describe('Integration::command', () => {
  dotenv.config();

  const dir = path.join(process.cwd(), 'test', 'testSync');
  const syamlPath = path.join(dir, 's.yaml');

  const access = `fc-sync-test-${Math.random().toString(36).substr(2)}`;
  const region = 'cn-shenzhen';
  const serviceName = `service-${new Date().getTime()}-${Math.random().toString(36).substr(2)}`;
  console.log('serviceName:: ', serviceName);
  const funcName = `func-${new Date().getTime()}-${Math.random().toString(36).substr(2)}`;
  const triggerName = `trigger-${new Date().getTime()}-${Math.random().toString(36).substr(2)}`;
  const zipFile = 'UEsDBAoAAAAIABULiFLOAhlFSQAAAE0AAAAIAAAAaW5kZXguanMdyMEJwCAMBdBVclNBskCxuxT9UGiJNgnFg8MX+o4Pc3R14/OQdkOpUFQ8mRQ2MtUujumJyv4PG6TFob3CjCEve78gtBaFkLYPUEsBAh4DCgAAAAgAFQuIUs4CGUVJAAAATQAAAAgAAAAAAAAAAAAAALSBAAAAAGluZGV4LmpzUEsFBgAAAAABAAEANgAAAG8AAAAAAA==';
  const functionConfig = {
    handler: 'index.handler',
    memorySize: 128,
    runtime: 'nodejs12',
  };

  const inputs: any = {
    props: {
      region,
      serviceName,
    },
    credentials: {},
    appName: 'fc-info-test',
    project: {
      access,
      component: '${path(.)}',
      projectName: 'test',
    },
    command: '',
    args: `--target-dir ${dir}`,
    path: {
      configPath: path.join(process.cwd(), '..', 'example', 's.yaml'),
    },
  };

  const client = new FC(process.env.AccountID, {
    region,
    accessKeyID: process.env.AccessKeyID,
    accessKeySecret: process.env.AccessKeySecret, 
  });

  afterEach(async () => {
    try {
      await fse.remove(dir);
    } catch (ex) { }
  })

  beforeAll(async () => {
    await exec(`s config add --AccountID ${process.env.AccountID} --AccessKeyID ${process.env.AccessKeyID} --AccessKeySecret ${process.env.AccessKeySecret} -a ${access}`);
  });

  afterAll(async () => {
    await exec(`s config delete -a ${access}`);
    await client.deleteTrigger(serviceName, funcName, triggerName);
    await client.deleteFunction(serviceName, funcName);
    await client.deleteService(serviceName);
    fse.removeSync(path.join(process.cwd(), '.s'));
  });

  it('sync error: service not fount', async () => {
    const inp = _.cloneDeep(inputs);
    const componentStarter = new ComponentStarter();
    await expect(componentStarter.sync(inp)).rejects.toThrowError(`service '${serviceName}' does not exist.`);
  });

  it('sync service', async () => {
    await client.createService(serviceName);

    const inp = _.cloneDeep(inputs);
    const componentStarter = new ComponentStarter();
    const result = await componentStarter.sync(inp);

    expect(result.configYmlPath).toEqual(syamlPath);
    const jsonYaml = getYamlData(syamlPath);
    expect(jsonYaml.services[`${region}-${serviceName}`]?.props).toMatchObject({
      region,
      service: {
        name: serviceName,
        internetAccess: true,
      }
    });
  });

  it('sync error: function not fount', async () => {
    const inp = _.cloneDeep(inputs);
    inp.props.functionName = funcName;
    const componentStarter = new ComponentStarter();
    await expect(componentStarter.sync(inp)).rejects.toThrowError(`function '${funcName}' does not exist in service '${serviceName}'.`);
  });

  it('sync function', async () => {
    await client.createFunction(serviceName, Object.assign({
      code: { zipFile },
      functionName: funcName,
    }, functionConfig));

    const inp = _.cloneDeep(inputs);
    inp.props.functionName = funcName;
    const componentStarter = new ComponentStarter();
    const { configYmlPath } = await componentStarter.sync(inp);

    expect(configYmlPath).toEqual(syamlPath);

    const jsonYaml = getYamlData(syamlPath);
    expect(jsonYaml.services[`${region}-${serviceName}-${funcName}`]?.props).toMatchObject({
      region,
      service: {
        name: serviceName,
        internetAccess: true,
      },
      function: Object.assign({ name: funcName }, functionConfig),
    });
  });

  it('sync trigger', async () => {
    await client.createTrigger(serviceName, funcName, {
      triggerName,
      triggerType: 'http',
      triggerConfig: {
        authType: 'anonymous',
        methods: ['GET']
      }
    });

    const inp = _.cloneDeep(inputs);
    inp.props.functionName = funcName;
    const componentStarter = new ComponentStarter();
    const { configYmlPath } = await componentStarter.sync(inp);
    expect(configYmlPath).toEqual(syamlPath);

    const jsonYaml = getYamlData(syamlPath);
    expect(jsonYaml.services[`${region}-${serviceName}-${funcName}`]?.props).toMatchObject({
      region,
      service: {
        name: serviceName,
        internetAccess: true,
      },
      function: Object.assign({ name: funcName }, functionConfig),
      triggers: [{
        name: triggerName,
        type: 'http',
        config: {
          authType: 'anonymous',
          methods: ['GET']
        }
      }]
    });
  });
});
