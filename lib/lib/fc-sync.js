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
var utils_1 = require("./utils");
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
    FcSync.prototype.sync = function (syncInputs, _a) {
        var _b, _c, _d, _e;
        var force = _a.force;
        return __awaiter(this, void 0, void 0, function () {
            var serviceName, functionName, _f, targetDir, isSyncCode, isSyncConfig, serviceConfig, functions, configs, codeFiles, _i, functions_1, func, funcName, _g, _h, triggers, configYmlPath;
            return __generator(this, function (_j) {
                switch (_j.label) {
                    case 0:
                        logger_1.default.debug("sync inputs is: " + JSON.stringify(syncInputs));
                        serviceName = syncInputs.serviceName, functionName = syncInputs.functionName, _f = syncInputs.targetDir, targetDir = _f === void 0 ? DEFAULT_SYNC_CODE_TARGET_DIR : _f, isSyncCode = syncInputs.isSyncCode, isSyncConfig = syncInputs.isSyncConfig;
                        return [4 /*yield*/, this.syncService({ serviceName: serviceName })];
                    case 1:
                        serviceConfig = _j.sent();
                        logger_1.default.debug("service config: " + JSON.stringify(serviceConfig));
                        return [4 /*yield*/, this.syncFunction({ serviceName: serviceName, functionName: functionName })];
                    case 2:
                        functions = _j.sent();
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
                        _j.label = 4;
                    case 4:
                        if (!(_i < functions_1.length)) return [3 /*break*/, 9];
                        func = functions_1[_i];
                        funcName = func.functionName;
                        if (!isSyncCode) return [3 /*break*/, 6];
                        _g = codeFiles;
                        _h = funcName;
                        return [4 /*yield*/, this.syncCode(serviceName, funcName, targetDir, force)];
                    case 5:
                        _g[_h] = _j.sent();
                        _j.label = 6;
                    case 6:
                        if (!isSyncConfig) return [3 /*break*/, 8];
                        func.name = funcName;
                        func.codeUri = codeFiles[funcName] || '******';
                        if (!(((_c = (_b = func.instanceLifecycleConfig) === null || _b === void 0 ? void 0 : _b.preStop) === null || _c === void 0 ? void 0 : _c.handler) || ((_e = (_d = func.instanceLifecycleConfig) === null || _d === void 0 ? void 0 : _d.preStop) === null || _e === void 0 ? void 0 : _e.handler))) {
                            delete func.instanceLifecycleConfig;
                        }
                        if (!func.initializer) {
                            delete func.initializer;
                            delete func.initializationTimeout;
                        }
                        return [4 /*yield*/, this.asyncTrigger({ serviceName: serviceName, functionName: funcName })];
                    case 7:
                        triggers = _j.sent();
                        logger_1.default.debug("get " + funcName + " triggers: " + JSON.stringify(triggers));
                        configs.push({
                            region: this.region,
                            service: serviceConfig,
                            function: _.pickBy(_.omit(func, DELETE_FUNCTION_KEY), _.identity),
                            triggers: triggers,
                        });
                        _j.label = 8;
                    case 8:
                        _i++;
                        return [3 /*break*/, 4];
                    case 9:
                        if (!isSyncConfig) return [3 /*break*/, 11];
                        return [4 /*yield*/, write_file_1.default.writeSYml(targetDir, configs, this.region + "-" + serviceName)];
                    case 10:
                        configYmlPath = _j.sent();
                        logger_1.default.log("You can deploy the latest configuration of your sync through the [s exec -t " + configYmlPath + " -- sync] command.", 'blue');
                        _j.label = 11;
                    case 11: return [2 /*return*/, { configs: configs, codeFiles: codeFiles, configYmlPath: configYmlPath }];
                }
            });
        });
    };
    FcSync.prototype.syncService = function (_a) {
        var _b, _c, _d;
        var serviceName = _a.serviceName;
        return __awaiter(this, void 0, void 0, function () {
            var serviceConfig, _e, userId, groupId, mountPoints;
            return __generator(this, function (_f) {
                switch (_f.label) {
                    case 0: return [4 /*yield*/, this.fcClient.getService(serviceName)];
                    case 1:
                        serviceConfig = (_f.sent()).data;
                        serviceConfig.name = serviceName;
                        if (!((_b = serviceConfig.logConfig) === null || _b === void 0 ? void 0 : _b.project)) {
                            delete serviceConfig.logConfig;
                        }
                        if (!((_c = serviceConfig.vpcConfig) === null || _c === void 0 ? void 0 : _c.vpcId)) {
                            delete serviceConfig.vpcConfig;
                        }
                        else {
                            serviceConfig.vpcConfig.vswitchIds = serviceConfig.vpcConfig.vSwitchIds;
                            delete serviceConfig.vpcConfig.role;
                            delete serviceConfig.vpcConfig.vSwitchIds;
                        }
                        if (_.isEmpty((_d = serviceConfig.nasConfig) === null || _d === void 0 ? void 0 : _d.mountPoints)) {
                            delete serviceConfig.nasConfig;
                        }
                        else {
                            _e = serviceConfig.nasConfig, userId = _e.userId, groupId = _e.groupId, mountPoints = _e.mountPoints;
                            serviceConfig.nasConfig = {
                                userId: userId,
                                groupId: groupId,
                                mountPoints: mountPoints === null || mountPoints === void 0 ? void 0 : mountPoints.map(function (item) {
                                    var _a = item.serverAddr.split(':'), serverAddr = _a[0], nasDir = _a[1];
                                    return { serverAddr: serverAddr, nasDir: nasDir, fcDir: item.mountDir };
                                })
                            };
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
    FcSync.prototype.syncCode = function (serviceName, functionName, codeZipFileTargetDir, force) {
        return __awaiter(this, void 0, void 0, function () {
            var targetDir, codeDir, data, url, codeZipFileName, zipFileUri;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        targetDir = path.resolve(codeZipFileTargetDir);
                        codeDir = path.join(targetDir, this.credentials.AccountID + "_" + this.region + "_" + serviceName + "_" + functionName);
                        if (!utils_1.checkDirExists(codeDir)) return [3 /*break*/, 1];
                        if (!force) {
                            throw new Error("The folder " + codeDir + " already exists, please specify -f/--force if it is forcibly overwritten.");
                        }
                        return [3 /*break*/, 3];
                    case 1: return [4 /*yield*/, fse.ensureDir(codeDir)];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3: return [4 /*yield*/, this.fcClient.getFunctionCode(serviceName, functionName)];
                    case 4:
                        data = (_a.sent()).data;
                        url = data.url;
                        codeZipFileName = this.credentials.AccountID + "_" + this.region + "_" + serviceName + "_" + functionName + ".zip";
                        logger_1.default.info("sync code to " + codeDir);
                        // 下载 code zip file
                        return [4 /*yield*/, core.downloadRequest(url, codeDir, { filename: codeZipFileName, extract: false })];
                    case 5:
                        // 下载 code zip file
                        _a.sent();
                        zipFileUri = path.join(codeDir, codeZipFileName);
                        return [4 /*yield*/, core.unzip(zipFileUri, codeDir)];
                    case 6:
                        _a.sent();
                        return [4 /*yield*/, fse.remove(zipFileUri)];
                    case 7:
                        _a.sent();
                        return [2 /*return*/, codeDir];
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmMtc3luYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9saWIvZmMtc3luYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQ0EsSUFBTSxFQUFFLEdBQUcsT0FBTyxDQUFDLGVBQWUsQ0FBQyxDQUFDO0FBQ3BDLHdDQUE0QjtBQUM1Qix5Q0FBNkI7QUFDN0IsNENBQWdDO0FBQ2hDLDBEQUE4QztBQUM5Qyw0REFBc0M7QUFDdEMsNERBQXFDO0FBQ3JDLGlDQUF5QztBQUV6QyxJQUFNLHNCQUFzQixHQUFXLEdBQUcsQ0FBQztBQUMzQyxJQUFNLDRCQUE0QixHQUFXLE9BQU8sQ0FBQyxHQUFHLEVBQUUsQ0FBQztBQUUzRCxJQUFNLGtCQUFrQixHQUFHLENBQUMsYUFBYSxFQUFFLFdBQVcsRUFBRSxhQUFhLEVBQUUsa0JBQWtCLENBQUMsQ0FBQztBQUMzRixJQUFNLG1CQUFtQixHQUFHLENBQUMsa0JBQWtCLEVBQUUsYUFBYSxFQUFFLGNBQWMsRUFBRSxVQUFVLEVBQUUsY0FBYyxFQUFFLFlBQVksQ0FBQyxDQUFDO0FBVzFIO0lBS0UsZ0JBQVksV0FBeUIsRUFBRSxNQUFNO1FBQzNDLElBQUksQ0FBQyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsRUFBRTtZQUFFLE1BQU0sSUFBSSxLQUFLLENBQUMsd0JBQXdCLENBQUMsQ0FBQztTQUFFO1FBQ25FLElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO1FBQ3JCLElBQUksQ0FBQyxXQUFXLEdBQUcsV0FBVyxDQUFDO1FBQy9CLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxFQUFFLENBQUMsV0FBVyxDQUFDLFNBQVMsRUFBRTtZQUM1QyxXQUFXLEVBQUUsV0FBVyxDQUFDLFdBQVc7WUFDcEMsZUFBZSxFQUFFLFdBQVcsQ0FBQyxlQUFlO1lBQzVDLGFBQWEsRUFB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