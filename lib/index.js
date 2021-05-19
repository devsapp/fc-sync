"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var base_1 = __importDefault(require("./common/base"));
var logger_1 = __importDefault(require("./common/logger"));
var core = __importStar(require("@serverless-devs/core"));
var _ = __importStar(require("lodash"));
var fc_sync_1 = __importDefault(require("./lib/fc-sync"));
var FcSyncComponent = /** @class */ (function (_super) {
    __extends(FcSyncComponent, _super);
    function FcSyncComponent(props) {
        return _super.call(this, props) || this;
    }
    FcSyncComponent.prototype.report = function (componentName, command, accountID, access) {
        return __awaiter(this, void 0, void 0, function () {
            var uid, credentials;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        uid = accountID;
                        if (!_.isEmpty(accountID)) return [3 /*break*/, 2];
                        return [4 /*yield*/, core.getCredential(access)];
                    case 1:
                        credentials = _a.sent();
                        uid = credentials.AccountID;
                        _a.label = 2;
                    case 2:
                        core.reportComponent(componentName, {
                            command: command,
                            uid: uid,
                        });
                        return [2 /*return*/];
                }
            });
        });
    };
    FcSyncComponent.prototype.argsParser = function (args) {
        var apts = {
            boolean: ['help', 'code'],
            alias: { 'help': 'h', 'access': 'a', 'region': 'r' },
        };
        var comParse = core.commandParse({ args: args }, apts);
        // 将Args转成Object
        var argsData = comParse.data || {};
        var region = argsData.region, access = argsData.access;
        var functionName = argsData['function-name'];
        var serviceName = argsData['service-name'];
        var triggerName = argsData['trigger-name'];
        var targetDir = argsData['target-dir'];
        var isSyncCode = argsData.code;
        return {
            region: region,
            functionName: functionName,
            serviceName: serviceName,
            triggerName: triggerName,
            isSyncCode: isSyncCode,
            targetDir: targetDir,
            access: access
        };
    };
    /**
     * demo 实例
     * @param inputs
     * @returns
     */
    FcSyncComponent.prototype.sync = function (inputs) {
        var _a, _b, _c, _d, _e;
        return __awaiter(this, void 0, void 0, function () {
            var parsedArgs, region, functionName, serviceName, isSyncCode, targetDir, access, credential, fcSync, codeZipFilePath;
            return __generator(this, function (_f) {
                switch (_f.label) {
                    case 0:
                        parsedArgs = this.argsParser(inputs === null || inputs === void 0 ? void 0 : inputs.args);
                        region = ((_a = inputs === null || inputs === void 0 ? void 0 : inputs.props) === null || _a === void 0 ? void 0 : _a.region) || (parsedArgs === null || parsedArgs === void 0 ? void 0 : parsedArgs.region);
                        functionName = ((_b = inputs === null || inputs === void 0 ? void 0 : inputs.props) === null || _b === void 0 ? void 0 : _b.functionName) || (parsedArgs === null || parsedArgs === void 0 ? void 0 : parsedArgs.functionName);
                        serviceName = ((_c = inputs === null || inputs === void 0 ? void 0 : inputs.props) === null || _c === void 0 ? void 0 : _c.serviceName) || (parsedArgs === null || parsedArgs === void 0 ? void 0 : parsedArgs.serviceName);
                        isSyncCode = parsedArgs.isSyncCode;
                        targetDir = ((_d = inputs === null || inputs === void 0 ? void 0 : inputs.props) === null || _d === void 0 ? void 0 : _d.targetDir) || (parsedArgs === null || parsedArgs === void 0 ? void 0 : parsedArgs.targetDir);
                        access = ((_e = inputs === null || inputs === void 0 ? void 0 : inputs.project) === null || _e === void 0 ? void 0 : _e.access) || (parsedArgs === null || parsedArgs === void 0 ? void 0 : parsedArgs.access);
                        return [4 /*yield*/, core.getCredential(access)];
                    case 1:
                        credential = _f.sent();
                        return [4 /*yield*/, this.report('fc-sync', 'sync', credential.AccountID, access)];
                    case 2:
                        _f.sent();
                        fcSync = new fc_sync_1.default(credential, region);
                        if (!isSyncCode) return [3 /*break*/, 4];
                        return [4 /*yield*/, fcSync.syncCode(serviceName, functionName, targetDir)];
                    case 3:
                        codeZipFilePath = _f.sent();
                        return [2 /*return*/, codeZipFilePath];
                    case 4:
                        logger_1.default.info('not support now.');
                        _f.label = 5;
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    return FcSyncComponent;
}(base_1.default));
exports.default = FcSyncComponent;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLHVEQUEwQztBQUMxQywyREFBcUM7QUFFckMsMERBQThDO0FBQzlDLHdDQUE0QjtBQUM1QiwwREFBbUM7QUFFbkM7SUFBNkMsbUNBQWE7SUFDeEQseUJBQVksS0FBSztlQUNmLGtCQUFNLEtBQUssQ0FBQztJQUNkLENBQUM7SUFFYSxnQ0FBTSxHQUFwQixVQUFxQixhQUFxQixFQUFFLE9BQWUsRUFBRSxTQUFrQixFQUFFLE1BQWU7Ozs7Ozt3QkFDMUYsR0FBRyxHQUFXLFNBQVMsQ0FBQzs2QkFDeEIsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsRUFBcEIsd0JBQW9CO3dCQUNZLHFCQUFNLElBQUksQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDLEVBQUE7O3dCQUE1RCxXQUFXLEdBQWlCLFNBQWdDO3dCQUNsRSxHQUFHLEdBQUcsV0FBVyxDQUFDLFNBQVMsQ0FBQzs7O3dCQUc5QixJQUFJLENBQUMsZUFBZSxDQUFDLGFBQWEsRUFBRTs0QkFDbEMsT0FBTyxTQUFBOzRCQUNQLEdBQUcsS0FBQTt5QkFDSixDQUFDLENBQUM7Ozs7O0tBQ0o7SUFFTyxvQ0FBVSxHQUFsQixVQUFtQixJQUFZO1FBQzdCLElBQU0sSUFBSSxHQUFRO1lBQ2hCLE9BQU8sRUFBRSxDQUFDLE1BQU0sRUFBRSxNQUFNLENBQUM7WUFDekIsS0FBSyxFQUFFLEVBQUUsTUFBTSxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxHQUFHLEVBQUM7U0FDcEQsQ0FBQztRQUNGLElBQU0sUUFBUSxHQUFRLElBQUksQ0FBQyxZQUFZLENBQUMsRUFBRSxJQUFJLE1BQUEsRUFBRSxFQUFFLElB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