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
var write_file_1 = __importDefault(require("./lib/write-file"));
var help_1 = __importDefault(require("./lib/help"));
var FcSyncComponent = /** @class */ (function (_super) {
    __extends(FcSyncComponent, _super);
    function FcSyncComponent(props) {
        return _super.call(this, props) || this;
    }
    /**
     * demo 实例
     * @param inputs
     * @returns
     */
    FcSyncComponent.prototype.sync = function (inputs) {
        var _a, _b, _c, _d, _e;
        return __awaiter(this, void 0, void 0, function () {
            var parsedArgs, access, credential, _f, endpoint, fcSync, _g, codeFiles, configYmlPath;
            return __generator(this, function (_h) {
                switch (_h.label) {
                    case 0:
                        parsedArgs = this.argsParser(inputs === null || inputs === void 0 ? void 0 : inputs.args);
                        logger_1.default.debug("parsed args: " + JSON.stringify(parsedArgs));
                        if (parsedArgs.isHelp) {
                            core.help(help_1.default);
                            return [2 /*return*/];
                        }
                        access = ((_a = inputs === null || inputs === void 0 ? void 0 : inputs.project) === null || _a === void 0 ? void 0 : _a.access) || (parsedArgs === null || parsedArgs === void 0 ? void 0 : parsedArgs.access);
                        write_file_1.default.access = access;
                        if (!_.isEmpty(inputs.credentials)) return [3 /*break*/, 2];
                        return [4 /*yield*/, core.getCredential(access)];
                    case 1:
                        _f = _h.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        _f = inputs.credentials;
                        _h.label = 3;
                    case 3:
                        credential = _f;
                        this.report('fc-sync', 'sync', credential.AccountID);
                        if (!(parsedArgs.region && parsedArgs.serviceName)) {
                            parsedArgs.region = (_b = inputs === null || inputs === void 0 ? void 0 : inputs.props) === null || _b === void 0 ? void 0 : _b.region;
                            parsedArgs.serviceName = (_c = inputs === null || inputs === void 0 ? void 0 : inputs.props) === null || _c === void 0 ? void 0 : _c.serviceName;
                            parsedArgs.functionName = (_d = inputs === null || inputs === void 0 ? void 0 : inputs.props) === null || _d === void 0 ? void 0 : _d.functionName;
                            parsedArgs.targetDir = ((_e = inputs === null || inputs === void 0 ? void 0 : inputs.props) === null || _e === void 0 ? void 0 : _e.targetDir) || (parsedArgs === null || parsedArgs === void 0 ? void 0 : parsedArgs.targetDir);
                        }
                        if (!(parsedArgs.region && parsedArgs.serviceName)) {
                            throw new Error('region/service-name required.');
                        }
                        return [4 /*yield*/, this.getFcEndpoint()];
                    case 4:
                        endpoint = _h.sent();
                        fcSync = new fc_sync_1.default(credential, parsedArgs.region, endpoint);
                        return [4 /*yield*/, fcSync.sync(parsedArgs, { force: parsedArgs.force })];
                    case 5:
                        _g = _h.sent(), codeFiles = _g.codeFiles, configYmlPath = _g.configYmlPath;
                        return [2 /*return*/, {
                                codeFiles: codeFiles,
                                configYmlPath: configYmlPath,
                            }];
                }
            });
        });
    };
    FcSyncComponent.prototype.getFcEndpoint = function () {
        return __awaiter(this, void 0, void 0, function () {
            var fcDefault, fcEndpoint, enableFcEndpoint;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, core.loadComponent('devsapp/fc-default')];
                    case 1:
                        fcDefault = _a.sent();
                        return [4 /*yield*/, fcDefault.get({ args: 'fc-endpoint' })];
                    case 2:
                        fcEndpoint = _a.sent();
                        if (!fcEndpoint) {
                            return [2 /*return*/, undefined];
                        }
                        return [4 /*yield*/, fcDefault.get({ args: 'enable-fc-endpoint' })];
                    case 3:
                        enableFcEndpoint = _a.sent();
                        return [2 /*return*/, (enableFcEndpoint === true || enableFcEndpoint === 'true') ? fcEndpoint : undefined];
                }
            });
        });
    };
    FcSyncComponent.prototype.report = function (componentName, command, uid) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                core.reportComponent(componentName, {
                    command: command,
                    uid: uid,
                });
                return [2 /*return*/];
            });
        });
    };
    FcSyncComponent.prototype.argsParser = function (args) {
        var apts = {
            boolean: ['help', 'force'],
            string: ['region', 'service-name', 'function-name', 'target-dir', 'type'],
            alias: { 'help': 'h', 'access': 'a', 'force': 'f' },
        };
        var comParse = core.commandParse({ args: args }, apts);
        // 将Args转成Object
        var argsData = comParse.data || {};
        var region = argsData.region, access = argsData.access, _a = argsData.type, type = _a === void 0 ? 'all' : _a, force = argsData.force;
        if (argsData.help) {
            return { isHelp: true };
        }
        var functionName = argsData['function-name'];
        var serviceName = argsData['service-name'];
        var targetDir = argsData['target-dir'];
        var isSyncCode = type === 'code' || type === 'all';
        var isSyncConfig = type === 'config' || type === 'all';
        return {
            force: force,
            region: region,
            serviceName: serviceName,
            functionName: functionName,
            isSyncCode: isSyncCode,
            isSyncConfig: isSyncConfig,
            targetDir: targetDir,
            access: access
        };
    };
    return FcSyncComponent;
}(base_1.default));
exports.default = FcSyncComponent;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLHVEQUEwQztBQUMxQywyREFBcUM7QUFFckMsMERBQThDO0FBQzlDLHdDQUE0QjtBQUM1QiwwREFBbUM7QUFDbkMsZ0VBQXlDO0FBQ3pDLG9EQUE4QjtBQUU5QjtJQUE2QyxtQ0FBYTtJQUN4RCx5QkFBWSxLQUFLO2VBQ2Ysa0JBQU0sS0FBSyxDQUFDO0lBQ2QsQ0FBQztJQUVEOzs7O09BSUc7SUFDRyw4QkFBSSxHQUFWLFVBQVksTUFBa0I7Ozs7Ozs7d0JBQ3RCLFVBQVUsR0FBUSxJQUFJLENBQUMsVUFBVSxDQUFDLE1BQU0sYUFBTixNQUFNLHVCQUFOLE1BQU0sQ0FBRSxJQUFJLENBQUMsQ0FBQzt3QkFDdEQsZ0JBQU0sQ0FBQyxLQUFLLENBQUMsa0JBQWdCLElBQUksQ0FBQyxTQUFTLENBQUMsVUFBVSxDQUFHLENBQUMsQ0FBQzt3QkFDM0QsSUFBSSxVQUFVLENBQUMsTUFBTSxFQUFFOzRCQUNyQixJQUFJLENBQUMsSUFBSSxDQUFDLGNBQUksQ0FBQyxDQUFDOzRCQUNoQixzQkFBTzt5QkFDUjt3QkFFSyxNQUFNLEdBQVcsT0FBQSxNQUFNLGFBQU4sTUFBTSx1QkFBTixNQUFNLENBQUUsT0FBTywwQ0FBRSxNQUFNLE1BQUksVUFBVSxhQUFWLFVBQVUsdUJBQVYsVUFBVSxDQUFFLE1BQU0sQ0FBQSxDQUFDO3dCQUNyRSxvQkFBUyxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7NkJBQ08sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLEVBQTdCLHdCQUE2Qjt3QkFBRyxxQkFBTSxJQUFJLENBQUMsYUFBYSxDQUFDLE1BQU0sQ0FBQyxFQUFBOzt3QkFBaEMsS0FB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