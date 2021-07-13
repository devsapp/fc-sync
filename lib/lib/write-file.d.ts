export default class WriteFile {
    static access: string;
    static writeSYml(targetDir: any, config: any, fileAffix?: any): Promise<string>;
    static getYmlFilePath(targetDir: any, fileAffix: any): string;
}
