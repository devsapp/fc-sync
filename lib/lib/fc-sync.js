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
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var FC = require('@alicloud/fc2');
var _ = __importStar(require("lodash"));
var path = __importStar(require("path"));
var fse = __importStar(require("fs-extra"));
var core = __importStar(require("@serverless-devs/core"));
var logger_1 = __importDefault(require("../common/logger"));
var write_file_1 = __importDefault(require("./write-file"));
var DEFAULT_CLIENT_TIMEOUT = 300;
var DEFAULT_SYNC_CODE_TARGET_DIR = process.cwd();
var DELETE_SERVICE_KEY = ['serviceName', 'serviceId', 'createdTime', 'lastModifiedTime'];
var DELETE_FUNCTION_KEY = ['lastModifiedTime', 'createdTime', 'codeChecksum', 'codeSize', 'functionName', 'functionId'];
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
            securityToken: credentials.SecurityToken,
            region: this.region,
            timeout: DEFAULT_CLIENT_TIMEOUT * 1000,
        });
    }
    FcSync.prototype.sync = function (syncInputs) {
        var _a, _b, _c, _d;
        return __awaiter(this, void 0, void 0, function () {
            var serviceName, functionName, _e, targetDir, isSyncCode, isSyncConfig, serviceConfig, functions, configs, codeFiles, _i, functions_1, func, funcName, _f, _g, triggers, configYmlPath;
            return __generator(this, function (_h) {
                switch (_h.label) {
                    case 0:
                        logger_1.default.debug("sync inputs is: " + JSON.stringify(syncInputs));
                        serviceName = syncInputs.serviceName, functionName = syncInputs.functionName, _e = syncInputs.targetDir, targetDir = _e === void 0 ? DEFAULT_SYNC_CODE_TARGET_DIR : _e, isSyncCode = syncInputs.isSyncCode, isSyncConfig = syncInputs.isSyncConfig;
                        return [4 /*yield*/, this.syncService({ serviceName: serviceName })];
                    case 1:
                        serviceConfig = _h.sent();
                        logger_1.default.debug("service config: " + JSON.stringify(serviceConfig));
                        return [4 /*yield*/, this.syncFunction({ serviceName: serviceName, functionName: functionName })];
                    case 2:
                        functions = _h.sent();
                        logger_1.default.debug("get functions: " + JSON.stringify(functions));
                        configs = [];
                        codeFiles = {};
                        if (!_.isEmpty(functions)) return [3 /*break*/, 3];
                        configs.push({
                            region: this.region,
                            service: serviceConfig,
                        });
                        return [3 /*break*/, 9];
                    case 3:
                        _i = 0, functions_1 = functions;
                        _h.label = 4;
                    case 4:
                        if (!(_i < functions_1.length)) return [3 /*break*/, 9];
                        func = functions_1[_i];
                        funcName = func.functionName;
                        if (!isSyncCode) return [3 /*break*/, 6];
                        _f = codeFiles;
                        _g = funcName;
                        return [4 /*yield*/, this.syncCode(serviceName, funcName, targetDir)];
                    case 5:
                        _f[_g] = _h.sent();
                        _h.label = 6;
                    case 6:
                        if (!isSyncConfig) return [3 /*break*/, 8];
                        func.name = funcName;
                        func.codeUri = codeFiles[funcName] || '******';
                        if (!(((_b = (_a = func.instanceLifecycleConfig) === null || _a === void 0 ? void 0 : _a.preStop) === null || _b === void 0 ? void 0 : _b.handler) || ((_d = (_c = func.instanceLifecycleConfig) === null || _c === void 0 ? void 0 : _c.preStop) === null || _d === void 0 ? void 0 : _d.handler))) {
                            delete func.instanceLifecycleConfig;
                        }
                        if (!func.initializer) {
                            delete func.initializer;
                            delete func.initializationTimeout;
                        }
                        return [4 /*yield*/, this.asyncTrigger({ serviceName: serviceName, functionName: funcName })];
                    case 7:
                        triggers = _h.sent();
                        logger_1.default.debug("get " + funcName + " triggers: " + JSON.stringify(triggers));
                        configs.push({
                            region: this.region,
                            service: serviceConfig,
                            function: _.pickBy(_.omit(func, DELETE_FUNCTION_KEY), _.identity),
                            triggers: triggers,
                        });
                        _h.label = 8;
                    case 8:
                        _i++;
                        return [3 /*break*/, 4];
                    case 9:
                        if (!isSyncConfig) return [3 /*break*/, 11];
                        return [4 /*yield*/, write_file_1.default.writeSYml(targetDir, configs, this.region + "-" + serviceName)];
                    case 10:
                        configYmlPath = _h.sent();
                        _h.label = 11;
                    case 11: return [2 /*return*/, { configs: configs, codeFiles: codeFiles, configYmlPath: configYmlPath }];
                }
            });
        });
    };
    FcSync.prototype.syncService = function (_a) {
        var _b, _c, _d;
        var serviceName = _a.serviceName;
        return __awaiter(this, void 0, void 0, function () {
            var serviceConfig;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0: return [4 /*yield*/, this.fcClient.getService(serviceName)];
                    case 1:
                        serviceConfig = (_e.sent()).data;
                        serviceConfig.name = serviceName;
                        if (!((_b = serviceConfig.logConfig) === null || _b === void 0 ? void 0 : _b.project)) {
                            delete serviceConfig.logConfig;
                        }
                        if (!((_c = serviceConfig.vpcConfig) === null || _c === void 0 ? void 0 : _c.vpcId)) {
                            delete serviceConfig.vpcConfig;
                        }
                        else {
                            delete serviceConfig.vpcConfig.role;
                        }
                        if (_.isEmpty((_d = serviceConfig.nasConfig) === null || _d === void 0 ? void 0 : _d.mountPoints)) {
                            delete serviceConfig.nasConfig;
                        }
                        if (_.isEmpty(serviceConfig.tracingConfig)) {
                            delete serviceConfig.tracingConfig;
                        }
                        delete serviceConfig.vendorConfig;
                        return [2 /*return*/, _.pickBy(_.omit(serviceConfig, DELETE_SERVICE_KEY), _.identity)];
                }
            });
        });
    };
    FcSync.prototype.syncFunction = function (_a) {
        var serviceName = _a.serviceName, functionName = _a.functionName;
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!functionName) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.fcClient.getFunction(serviceName, functionName)];
                    case 1: return [2 /*return*/, [(_b.sent()).data]];
                    case 2: return [4 /*yield*/, this.nextListData('listFunctions', 'functions', [serviceName])];
                    case 3: return [2 /*return*/, _b.sent()];
                }
            });
        });
    };
    FcSync.prototype.syncCode = function (serviceName, functionName, codeZipFileTargetDir) {
        return __awaiter(this, void 0, void 0, function () {
            var targetDir, data, url, codeZipFileName;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        targetDir = path.resolve(codeZipFileTargetDir);
                        return [4 /*yield*/, this.fcClient.getFunctionCode(serviceName, functionName)];
                    case 1:
                        data = (_a.sent()).data;
                        url = data.url;
                        codeZipFileName = this.credentials.AccountID + "_" + this.region + "_" + serviceName + "_" + functionName + ".zip";
                        return [4 /*yield*/, fse.ensureDir(targetDir)];
                    case 2:
                        _a.sent();
                        logger_1.default.info("sync code to " + targetDir);
                        // 下载 code zip file
                        return [4 /*yield*/, core.downloadRequest(url, targetDir, { filename: codeZipFileName, extract: false })];
                    case 3:
                        // 下载 code zip file
                        _a.sent();
                        return [2 /*return*/, path.join(targetDir, codeZipFileName)];
                }
            });
        });
    };
    FcSync.prototype.asyncTrigger = function (_a) {
        var serviceName = _a.serviceName, functionName = _a.functionName;
        return __awaiter(this, void 0, void 0, function () {
            var triggers;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.nextListData('listTriggers', 'triggers', [serviceName, functionName])];
                    case 1:
                        triggers = _b.sent();
                        return [2 /*return*/, triggers.map(function (trigger) { return ({
                                name: trigger.triggerName,
                                description: trigger.description,
                                sourceArn: trigger.sourceArn || undefined,
                                type: trigger.triggerType,
                                invocationRole: trigger.invocationRole || undefined,
                                qualifier: trigger.qualifier || undefined,
                                config: trigger.triggerConfig,
                            }); })];
                }
            });
        });
    };
    FcSync.prototype.nextListData = function (method, dataKey, paths) {
        return __awaiter(this, void 0, void 0, function () {
            var query, data, res;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        query = {};
                        data = [];
                        _b.label = 1;
                    case 1: return [4 /*yield*/, (_a = this.fcClient)[method].apply(_a, __spreadArrays(paths, [query]))];
                    case 2:
                        res = (_b.sent()).data;
                        data = data.concat(res[dataKey]);
                        query.nextToken = res.nextToken;
                        _b.label = 3;
                    case 3:
                        if (query.nextToken) return [3 /*break*/, 1];
                        _b.label = 4;
                    case 4: return [2 /*return*/, data];
                }
            });
        });
    };
    return FcSync;
}());
exports.default = FcSync;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmMtc3luYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9saWIvZmMtc3luYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQ0EsSUFBTSxFQUFFLEdBQUcsT0FBTyxDQUFDLGVBQWUsQ0FBQyxDQUFDO0FBQ3BDLHdDQUE0QjtBQUM1Qix5Q0FBNkI7QUFDN0IsNENBQWdDO0FBQ2hDLDBEQUE4QztBQUM5Qyw0REFBc0M7QUFDdEMsNERBQXFDO0FBRXJDLElBQU0sc0JBQXNCLEdBQVcsR0FBRyxDQUFDO0FBQzNDLElBQU0sNEJBQTRCLEdBQVcsT0FBTyxDQUFDLEdBQUcsRUFBRSxDQUFDO0FBRTNELElBQU0sa0JBQWtCLEdBQUcsQ0FBQyxhQUFhLEVBQUUsV0FBVyxFQUFFLGFBQWEsRUFBRSxrQkFBa0IsQ0FBQyxDQUFDO0FBQzNGLElBQU0sbUJBQW1CLEdBQUcsQ0FBQyxrQkFBa0IsRUFBRSxhQUFhLEVBQUUsY0FBYyxFQUFFLFVBQVUsRUFBRSxjQUFjLEVBQUUsWUFBWSxDQUFDLENBQUM7QUFXMUg7SUFLRSxnQkFBWSxXQUF5QixFQUFFLE1BQU07UUFDM0MsSUFBSSxDQUFDLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxFQUFFO1lBQUUsTUFBTSxJQUFJLEtBQUssQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDO1NBQUU7UUFDbkUsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7UUFDckIsSUFBSSxDQUFDLFdBQVcsR0FBRyxXQUFXLENBQUM7UUFDL0IsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLEVBQUUsQ0FBQyxXQUFXLENBQUMsU0FBUyxFQUFFO1lBQzVDLFdBQVcsRUFBRSxXQUFXLENBQUMsV0FBVztZQUNwQyxlQUFlLEVBQUUsV0FBVyxDQUFDLGVBQWU7WUFDNUMsYUFBYSxFQUFFLFdBQVcsQ0FBQyxh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