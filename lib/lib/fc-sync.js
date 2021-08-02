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
var _ = __importStar(require("lodash"));
var path = __importStar(require("path"));
var fse = __importStar(require("fs-extra"));
var core = __importStar(require("@serverless-devs/core"));
var logger_1 = __importDefault(require("../common/logger"));
var write_file_1 = __importDefault(require("./write-file"));
var utils_1 = require("./utils");
var FC = require('@alicloud/fc2');
var DEFAULT_CLIENT_TIMEOUT = 300;
var DEFAULT_SYNC_CODE_TARGET_DIR = process.cwd();
var DELETE_SERVICE_KEY = ['serviceName', 'serviceId', 'createdTime', 'lastModifiedTime'];
var DELETE_FUNCTION_KEY = ['lastModifiedTime', 'createdTime', 'codeChecksum', 'codeSize', 'functionName', 'functionId'];
var FcSync = /** @class */ (function () {
    function FcSync(credentials, region, endpoint) {
        if (_.isNil(region)) {
            throw new Error('please provide region.');
        }
        this.region = region;
        this.credentials = credentials;
        this.fcClient = new FC(credentials.AccountID, {
            region: region,
            endpoint: endpoint,
            accessKeyID: credentials.AccessKeyID,
            accessKeySecret: credentials.AccessKeySecret,
            securityToken: credentials.SecurityToken,
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmMtc3luYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9saWIvZmMtc3luYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQ0Esd0NBQTRCO0FBQzVCLHlDQUE2QjtBQUM3Qiw0Q0FBZ0M7QUFDaEMsMERBQThDO0FBQzlDLDREQUFzQztBQUN0Qyw0REFBcUM7QUFDckMsaUNBQXlDO0FBRXpDLElBQU0sRUFBRSxHQUFHLE9BQU8sQ0FBQyxlQUFlLENBQUMsQ0FBQztBQUVwQyxJQUFNLHNCQUFzQixHQUFXLEdBQUcsQ0FBQztBQUMzQyxJQUFNLDRCQUE0QixHQUFXLE9BQU8sQ0FBQyxHQUFHLEVBQUUsQ0FBQztBQUUzRCxJQUFNLGtCQUFrQixHQUFHLENBQUMsYUFBYSxFQUFFLFdBQVcsRUFBRSxhQUFhLEVBQUUsa0JBQWtCLENBQUMsQ0FBQztBQUMzRixJQUFNLG1CQUFtQixHQUFHLENBQUMsa0JBQWtCLEVBQUUsYUFBYSxFQUFFLGNBQWMsRUFBRSxVQUFVLEVBQUUsY0FBYyxFQUFFLFlBQVksQ0FBQyxDQUFDO0FBVzFIO0lBS0UsZ0JBQVksV0FBeUIsRUFBRSxNQUFjLEVBQUUsUUFBZ0I7UUFDckUsSUFBSSxDQUFDLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxFQUFFO1lBQUUsTUFBTSxJQUFJLEtBQUssQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDO1NBQUU7UUFDbkUsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7UUFDckIsSUFBSSxDQUFDLFdBQVcsR0FBRyxXQUFXLENBQUM7UUFDL0IsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLEVBQUUsQ0FBQyxXQUFXLENBQUMsU0FBUyxFQUFFO1lBQzVDLE1BQU0sUUFBQTtZQUNOLFFBQVEsVUFBQTtZQUNSLFdBQVcsRUFBRSxXQUFXLENBQUMsV0FBVztZQUNw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