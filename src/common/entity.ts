export interface ICredentials {
  AccountID?: string;
  AccessKeyID?: string;
  SecurityToken?: string;
  AccessKeySecret?: string;
}

export interface InputProps {
  props: any;
  credentials: ICredentials;
  appName: string;
  project: {
    component: string;
    access: string;
    projectName: string;
  };
  command: string;
  args: string;
  path: {
    configPath: string;
  };
}
