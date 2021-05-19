import { ICredentials } from '../common/entity';
export default class FcSync {
    private fcClient;
    private region;
    private credentials;
    constructor(credentials: ICredentials, region: any);
    syncCode(serviceName: string, functionName: string, targetDir?: string): Promise<string>;
}
