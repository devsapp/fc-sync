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
    /**
     * demo 实例
     * @param inputs
     * @returns
     */
    FcSyncComponent.prototype.sync = function (inputs) {
        var _a, _b, _c, _d, _e;
        return __awaiter(this, void 0, void 0, function () {
            var parsedArgs, access, credential, fcSync, _f, codeFiles, configYmlPath;
            return __generator(this, function (_g) {
                switch (_g.label) {
                    case 0:
                        parsedArgs = this.argsParser(inputs === null || inputs === void 0 ? void 0 : inputs.args);
                        logger_1.default.debug("parsed args: " + JSON.stringify(parsedArgs));
                        if (parsedArgs.isHelp) {
                            core.help(help_1.default);
                            return [2 /*return*/];
                        }
                        access = ((_a = inputs === null || inputs === void 0 ? void 0 : inputs.project) === null || _a === void 0 ? void 0 : _a.access) || (parsedArgs === null || parsedArgs === void 0 ? void 0 : parsedArgs.access);
                        write_file_1.default.access = access;
                        return [4 /*yield*/, core.getCredential(access)];
                    case 1:
                        credential = _g.sent();
                        this.report('fc-sync', 'sync', credential.AccountID, access);
                        if (!(parsedArgs.region && parsedArgs.serviceName)) {
                            parsedArgs.region = (_b = inputs === null || inputs === void 0 ? void 0 : inputs.props) === null || _b === void 0 ? void 0 : _b.region;
                            parsedArgs.serviceName = (_c = inputs === null || inputs === void 0 ? void 0 : inputs.props) === null || _c === void 0 ? void 0 : _c.serviceName;
                            parsedArgs.functionName = (_d = inputs === null || inputs === void 0 ? void 0 : inputs.props) === null || _d === void 0 ? void 0 : _d.functionName;
                            parsedArgs.targetDir = ((_e = inputs === null || inputs === void 0 ? void 0 : inputs.props) === null || _e === void 0 ? void 0 : _e.targetDir) || (parsedArgs === null || parsedArgs === void 0 ? void 0 : parsedArgs.targetDir);
                        }
                        if (!(parsedArgs.region && parsedArgs.serviceName)) {
                            throw new Error('region/service-name required.');
                        }
                        fcSync = new fc_sync_1.default(credential, parsedArgs.region);
                        return [4 /*yield*/, fcSync.sync(parsedArgs, { force: parsedArgs.force })];
                    case 2:
                        _f = _g.sent(), codeFiles = _f.codeFiles, configYmlPath = _f.configYmlPath;
                        return [2 /*return*/, {
                                codeFiles: codeFiles,
                                configYmlPath: configYmlPath,
                            }];
                }
            });
        });
    };
    return FcSyncComponent;
}(base_1.default));
exports.default = FcSyncComponent;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLHVEQUEwQztBQUMxQywyREFBcUM7QUFFckMsMERBQThDO0FBQzlDLHdDQUE0QjtBQUM1QiwwREFBbUM7QUFDbkMsZ0VBQXlDO0FBQ3pDLG9EQUE4QjtBQUU5QjtJQUE2QyxtQ0FBYTtJQUN4RCx5QkFBWSxLQUFLO2VBQ2Ysa0JBQU0sS0FBSyxDQUFDO0lBQ2QsQ0FBQztJQUVhLGdDQUFNLEdBQXBCLFVBQXFCLGFBQXFCLEVBQUUsT0FBZSxFQUFFLFNBQWtCLEVBQUUsTUFBZTs7Ozs7O3dCQUMxRixHQUFHLEdBQVcsU0FBUyxDQUFDOzZCQUN4QixDQUFDLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxFQUFwQix3QkFBb0I7d0JBQ1kscUJBQU0sSUFBSSxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUMsRUFBQTs7d0JBQTVELFdBQVcsR0FBaUIsU0FBZ0M7d0JBQ2xFLEdBQUcsR0FBRyxXQUFXLENBQUMsU0FBUyxDQUFDOzs7d0JBRzlCLElBQUksQ0FBQyxlQUFlLENBQUMsYUFBYSxFQUFFOzRCQUNsQyxPQUFPLFNBQUE7NEJBQ1AsR0FBRyxLQUFBO3lCQUNKLENBQUMsQ0FBQzs7Ozs7S0FDSjtJQUVPLG9DQUFVLEdBQWxCLFVBQW1CLElBQVk7UUFDN0IsSUFBTSxJQUFJLEdBQVE7WUFDaEIsT0FBTyxFQUFFLENBQUMsTUFBTSxFQUFFLE9BQU8sQ0FBQztZQUMxQixNQUFNLEVBQUUsQ0FBQyxRQUFRLEVBQUUsY0FBYyxFQUFFLGVBQWUsRUFBRSxZQUFZLEVBQUUsTUFBTSxDQUFDO1lBQ3pFLEtBQUssRUFBRSxFQUFFLE1BQU0sRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLEdBQUcsRUFBRSxP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