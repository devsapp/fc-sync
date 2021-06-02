import * as fse from 'fs-extra';
import * as path from 'path';
import yaml from 'js-yaml';

const checkFileExists = (filePath) => {
  try {
    if (fse.statSync(filePath).isFile()) {
      return true;
    }
  // @ts-ignore
  } catch(ex) {}
  return false;
}
const component = 'devsapp/fc';

export default class WriteFile {
  static async writeSYml(targetDir, config) {
    targetDir = path.resolve(targetDir);
    const ymlPath = this.getYmlFilePath(targetDir);

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

  static getYmlFilePath(targetDir) {
    const sYml = path.join(targetDir, 's.yml');
    const sYaml = path.join(targetDir, 's.yaml');
    if (!(checkFileExists(sYml) || checkFileExists(sYaml))) {
      return sYaml;
    }

    return path.join(targetDir, 's.sync.yaml');
  }
}