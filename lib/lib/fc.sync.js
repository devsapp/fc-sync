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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var FC = require('@alicloud/fc2');
var _ = __importStar(require("lodash"));
var path = __importStar(require("path"));
var os = __importStar(require("os"));
var fse = __importStar(require("fs-extra"));
var core = __importStar(require("@serverless-devs/core"));
var DEFAULT_CLIENT_TIMEOUT = 300;
var DEFAULT_SYNC_CODE_TARGET_DIR = path.join(os.homedir(), '.s', 'cache', 'fc-sync', 'code');
var FcSync = /** @class */ (function () {
    function FcSync(credentials, region) {
        if (_.isNil(region)) {
            throw new Error('please provide region.');
        }
        this.region = region;
        this.credentials = credentials;
        this.fcClient = new FC(credentials.AccountID, {
            accessKeyID: credentials.AccessKeyID,
            accessKeySecret: credentials.AccessKeySecret,
            securityToken: credentials.stsToken,
            region: this.region,
            timeout: DEFAULT_CLIENT_TIMEOUT * 1000,
        });
    }
    FcSync.prototype.syncCode = function (serviceName, functionName, targetDir) {
        return __awaiter(this, void 0, void 0, function () {
            var data, url, codeZipFileName, codeZipFileTargetDir;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.fcClient.getFunctionCode(serviceName, functionName)];
                    case 1:
                        data = (_a.sent()).data;
                        url = data.url;
                        codeZipFileName = this.credentials.AccountID + "_" + this.region + "_" + serviceName + "_" + functionName + ".zip";
                        codeZipFileTargetDir = _.isNil(targetDir) ? DEFAULT_SYNC_CODE_TARGET_DIR : targetDir;
                        if (!(codeZipFileTargetDir === DEFAULT_SYNC_CODE_TARGET_DIR)) return [3 /*break*/, 3];
                        return [4 /*yield*/, fse.ensureDir(DEFAULT_SYNC_CODE_TARGET_DIR)];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3: 
                    // 下载 code zip file
                    return [4 /*yield*/, core.downloadRequest(url, codeZipFileTargetDir, { filename: codeZipFileName, extract: false })];
                    case 4:
                        // 下载 code zip file
                        _a.sent();
                        return [2 /*return*/, path.join(codeZipFileTargetDir, codeZipFileName)];
                }
            });
        });
    };
    return FcSync;
}());
exports.default = FcSync;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmMuc3luYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9saWIvZmMuc3luYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFDQSxJQUFNLEVBQUUsR0FBRyxPQUFPLENBQUMsZUFBZSxDQUFDLENBQUM7QUFDcEMsd0NBQTRCO0FBQzVCLHlDQUE2QjtBQUM3QixxQ0FBeUI7QUFDekIsNENBQWdDO0FBQ2hDLDBEQUE4QztBQUU5QyxJQUFNLHNCQUFzQixHQUFXLEdBQUcsQ0FBQztBQUMzQyxJQUFNLDRCQUE0QixHQUFXLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLE9BQU8sRUFBRSxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sQ0FBQyxDQUFDO0FBRXZHO0lBS0UsZ0JBQVksV0FBeUIsRUFBRSxNQUFNO1FBQzNDLElBQUksQ0FBQyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsRUFBRTtZQUFFLE1BQU0sSUFBSSxLQUFLLENBQUMsd0JBQXdCLENBQUMsQ0FBQztTQUFFO1FBQ25FLElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO1FBQ3JCLElBQUksQ0FBQyxXQUFXLEdBQUcsV0FBVyxDQUFDO1FBQy9CLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxFQUFFLENBQUMsV0FBVyxDQUFDLFNBQVMsRUFBRTtZQUM1QyxXQUFXLEVBQUUsV0FBVyxDQUFDLFdBQVc7WUFDcEMsZUFBZSxFQUFFLFdBQVcsQ0FBQyxlQUFlO1lBQzVDLGFBQWEsRUFBRSxXQUFXLENBQUMsUUFBUTtZQUNuQyxNQUFNLEVBQUUsSUFBSSxDQUFDLE1BQU07WUFDbkIsT0FBTyxFQUFFLHNCQUFzQixHQUFHLElBQUk7U0FDdkMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUVLLHlCQUFRLEdBQWQsVUFBZSxXQUFtQixFQUFFLFlBQW9CLEVBQUUsU0FBa0I7Ozs7OzRCQUN6RCxxQkFBTSxJQUFJLENBQUMsUUFBUSxDQUFDLGVBQWUsQ0FBQyxXQUFXLEVBQUUsWUFBWSxDQUFDLEVBQUE7O3dCQUF2RSxJQUFJLEdBQUssQ0FBQSxTQUE4RCxDQUFBLEtBQW5FO3dCQUNKLEdBQUcsR0FBSyxJQUFJLElBQVQsQ0FBVTt3QkFDZixlQUFlLEdBQWMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxTQUFTLFNBQUksSUFBSSxDQUFDLE1BQU0sU0FBSSxXQUFXLFNBQUksWUFBWSxTQUFNLENBQUM7d0JBQzVHLG9CQUFvQixHQUFXLENBQUMsQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLDRCQUE0QixDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUM7NkJBQy9GLENBQUEsb0JBQW9CLEtBQUssNEJBQTRCLENBQUEsRUFBckQsd0JBQXFEO3dCQUN2RCxxQkFBTSxHQUFHLENBQUMsU0FBUyxDQUFDLDRCQUE0QixDQUFDLEVBQUE7O3dCQUFqRCxTQUFpRCxDQUFDOzs7b0JBRXBELG1CQUFtQjtvQkFDbkIscUJBQU0sSUFBSSxDQUFDLGVBQWUsQ0FBQyxHQUFHLEVBQUUsb0JBQW9CLEVBQUUsRUFBQyxRQUFRLEVBQUUsZUFBZSxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUMsQ0FBQyxFQUFBOzt3QkFEbEcsbUJBQW1CO3dCQUNuQixTQUFrRyxDQUFDO3dCQUNuRyxzQkFBTyxJQUFJLENBQUMsSUFBSSxDQUFDLG9CQUFvQixFQUFFLGVBQWUsQ0FBQyxFQUFDOzs7O0tBQ3pEO0lBQ0gsYUFBQztBQUFELENBQUMsQUE5QkQsSUE4QkMifQ==