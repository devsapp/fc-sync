"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkDirExists = exports.checkFileExists = void 0;
var fse = __importStar(require("fs-extra"));
exports.checkFileExists = function (filePath) {
    try {
        if (fse.statSync(filePath).isFile()) {
            return true;
        }
        // @ts-ignore
    }
    catch (ex) { }
    return false;
};
exports.checkDirExists = function (dirPath) {
    try {
        if (fse.statSync(dirPath).isDirectory()) {
            return true;
        }
        // @ts-ignore
    }
    catch (ex) { }
    return false;
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvbGliL3V0aWxzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSw0Q0FBZ0M7QUFFbkIsUUFBQSxlQUFlLEdBQUcsVUFBQyxRQUFRO0lBQ3RDLElBQUk7UUFDRixJQUFJLEdBQUcsQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLENBQUMsTUFBTSxFQUFFLEVBQUU7WUFDbkMsT0FBTyxJQUFJLENBQUM7U0FDYjtRQUNILGFBQWE7S0FDWjtJQUFDLE9BQU0sRUFBRSxFQUFFLEdBQUU7SUFDZCxPQUFPLEtBQUssQ0FBQztBQUNmLENBQUMsQ0FBQTtBQUVZLFFBQUEsY0FBYyxHQUFHLFVBQUMsT0FBTztJQUNwQyxJQUFJO1FBQ0YsSUFBSSxHQUFHLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDLFdBQVcsRUFBRSxFQUFFO1lBQ3ZDLE9BQU8sSUFBSSxDQUFDO1NBQ2I7UUFDSCxhQUFhO0tBQ1o7SUFBQyxPQUFNLEVBQUUsRUFBRSxHQUFFO0lBQ2QsT0FBTyxLQUFLLENBQUM7QUFDZixDQUFDLENBQUEifQ==