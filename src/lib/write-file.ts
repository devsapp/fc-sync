import * as fse from 'fs-extra';
import * as path from 'path';
import yaml from 'js-yaml';
import { checkFileExists } from './utils';

const component = 'devsapp/fc';

export default class WriteFile {
  static async writeSYml(targetDir, config, fileAffix?) {
    targetDir = path.resolve(targetDir);
    const ymlPath = this.getYmlFilePath(targetDir, fileAffix);

    const ymlConfig = {};
    for (const props of config) {
      const functionName = props.function?.name ? `-${props.function?.name}` : '';
      const componentName = `${props.region}-${props.service.name}${functionName}`;
      ymlConfig[componentName] = { component, props };
    }
    
    const configStr = yaml.dump({
      edition: '1.0.0',
      name: 'compoent-test',
      services: JSON.parse(JSON.stringify(ymlConfig)),
    });

    await fse.ensureDir(targetDir);
    await fse.writeFile(ymlPath, configStr);
    return ymlPath;
  }

  static getYmlFilePath(targetDir, fileAffix) {
    const sYml = path.join(targetDir, 's.yml');
    const sYaml = path.join(targetDir, 's.yaml');
    if (!(checkFileExists(sYml) || checkFileExists(sYaml))) {
      return sYaml;
    }

    const fileName = fileAffix ? `s.${fileAffix}.sync.yaml` : 's.sync.yaml';
    return path.join(targetDir, fileName);
  }
}