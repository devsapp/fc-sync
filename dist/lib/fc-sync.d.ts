import { ICredentials } from '../common/entity';
import * as _ from 'lodash';
interface ISync {
    region: string;
    serviceName: string;
    functionName?: string;
    targetDir?: string;
    isSyncCode?: boolean;
    isSyncConfig?: boolean;
}
export default class FcSync {
    private fcClient;
    private region;
    private credentials;
    constructor(credentials: ICredentials, region: string, endpoint: string);
    sync(syncInputs: ISync, { force }: {
        force: any;
    }): Promise<{
        configs: any[];
        codeFiles: {};
        configYmlPath: any;
    }>;
    syncService({ serviceName, }: {
        serviceName: any;
    }): Promise<_.Dictionary<any>>;
    syncFunction({ serviceName, functionName, }: {
        serviceName: any;
        functionName: any;
    }): Promise<any[]>;
    getFunctionAsyncConfig({ serviceName, functionName }: {
        serviceName: any;
        functionName: any;
    }): Promise<{
        destination: {
            onSuccess: any;
            onFailure: any;
        };
        maxAsyncEventAgeInSeconds: any;
        maxAsyncRetryAttempts: any;
        statefulInvocation: any;
    }>;
    syncCode(serviceName: string, functionName: string, codeZipFileTargetDir: string, force: boolean): Promise<string>;
    asyncTrigger({ serviceName, functionName, }: {
        serviceName: any;
        functionName: any;
    }): Promise<{
        name: any;
        description: any;
        sourceArn: any;
        type: any;
        invocationRole: any;
        qualifier: any;
        config: any;
    }[]>;
    nextListData(method: any, dataKey: any, paths: any): Promise<any[]>;
}
export {};