import BaseComponent from './common/base';
import { InputProps } from './common/entity';
export default class FcSyncComponent extends BaseComponent {
    constructor(props: any);
    private report;
    private argsParser;
    /**
     * demo 实例
     * @param inputs
     * @returns
     */
    sync(inputs: InputProps): Promise<any>;
}
