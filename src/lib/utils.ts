import * as fse from 'fs-extra';

export const checkFileExists = (filePath) => {
  try {
    if (fse.statSync(filePath).isFile()) {
      return true;
    }
  } catch (ex) {
    // @ts-ignore
  }
  return false;
};

export const checkDirExists = (dirPath) => {
  try {
    if (fse.statSync(dirPath).isDirectory()) {
      return true;
    }
  } catch (ex) {
    // @ts-ignore
  }
  return false;
};
