import BaseComponent from './common/base';
import { InputProps } from './common/entity';
export default class FcSyncComponent extends BaseComponent {
    constructor(props: any);
    /**
     * demo 实例
     * @param inputs
     * @returns
     */
    sync(inputs: InputProps): Promise<any>;
    private getFcEndpoint;
    private report;
    private argsParser;
}
