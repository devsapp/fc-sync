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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fse = __importStar(require("fs-extra"));
var path = __importStar(require("path"));
var js_yaml_1 = __importDefault(require("js-yaml"));
var checkFileExists = function (filePath) {
    try {
        if (fse.statSync(filePath).isFile()) {
            return true;
        }
        // @ts-ignore
    }
    catch (ex) { }
    return false;
};
var component = 'devsapp/fc';
var WriteFile = /** @class */ (function () {
    function WriteFile() {
    }
    WriteFile.writeSYml = function (targetDir, config, fileAffix) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function () {
            var ymlPath, ymlConfig, _i, config_1, props, functionName, componentName, configStr;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        targetDir = path.resolve(targetDir);
                        ymlPath = this.getYmlFilePath(targetDir, fileAffix);
                        ymlConfig = {};
                        for (_i = 0, config_1 = config; _i < config_1.length; _i++) {
                            props = config_1[_i];
                            functionName = ((_a = props.function) === null || _a === void 0 ? void 0 : _a.name) ? "-" + ((_b = props.function) === null || _b === void 0 ? void 0 : _b.name) : '';
                            componentName = props.region + "-" + props.service.name + functionName;
                            ymlConfig[componentName] = { component: component, props: props };
                        }
                        configStr = js_yaml_1.default.dump({
                            edition: '1.0.0',
                            name: 'compoent-test',
                            services: JSON.parse(JSON.stringify(ymlConfig)),
                        });
                        return [4 /*yield*/, fse.ensureDir(targetDir)];
                    case 1:
                        _c.sent();
                        return [4 /*yield*/, fse.writeFile(ymlPath, configStr)];
                    case 2:
                        _c.sent();
                        return [2 /*return*/, ymlPath];
                }
            });
        });
    };
    WriteFile.getYmlFilePath = function (targetDir, fileAffix) {
        var sYml = path.join(targetDir, 's.yml');
        var sYaml = path.join(targetDir, 's.yaml');
        if (!(checkFileExists(sYml) || checkFileExists(sYaml))) {
            return sYaml;
        }
        var fileName = fileAffix ? "s." + fileAffix + ".sync.yaml" : 's.sync.yaml';
        return path.join(targetDir, fileName);
    };
    return WriteFile;
}());
exports.default = WriteFile;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid3JpdGUtZmlsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9saWIvd3JpdGUtZmlsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSw0Q0FBZ0M7QUFDaEMseUNBQTZCO0FBQzdCLG9EQUEyQjtBQUUzQixJQUFNLGVBQWUsR0FBRyxVQUFDLFFBQVE7SUFDL0IsSUFBSTtRQUNGLElBQUksR0FBRyxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQyxNQUFNLEVBQUUsRUFBRTtZQUNuQyxPQUFPLElBQUksQ0FBQztTQUNiO1FBQ0gsYUFBYTtLQUNaO0lBQUMsT0FBTSxFQUFFLEVBQUUsR0FBRTtJQUNkLE9BQU8sS0FBSyxDQUFDO0FBQ2YsQ0FBQyxDQUFBO0FBQ0QsSUFBTSxTQUFTLEdBQUcsWUFBWSxDQUFDO0FBRS9CO0lBQUE7SUFpQ0EsQ0FBQztJQWhDYyxtQkFBUyxHQUF0QixVQUF1QixTQUFTLEVBQUUsTUFBTSxFQUFFLFNBQVU7Ozs7Ozs7d0JBQ2xELFNBQVMsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDO3dCQUM5QixPQUFPLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQyxTQUFTLEVBQUUsU0FBUyxDQUFDLENBQUM7d0JBRXBELFNBQVMsR0FBRyxFQUFFLENBQUM7d0JBQ3JCLFdBQTBCLEVBQU4saUJBQU0sRUFBTixvQkFBTSxFQUFOLElBQU0sRUFBRTs0QkFBakIsS0FBSzs0QkFDUixZQUFZLEdBQUcsT0FBQSxLQUFLLENBQUMsUUFBUSwwQ0FBRSxJQUFJLEVBQUMsQ0FBQyxDQUFDLGFBQUksS0FBSyxDQUFDLFFBQVEsMENBQUUsSUFBSSxDQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQzs0QkFDdEUsYUFBYSxHQUFNLEtBQUssQ0FBQyxNQUFNLFNBQUksS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFJLEdBQUcsWUFBYyxDQUFDOzRCQUM3RSxTQUFTLENBQUMsYUFBYSxDQUFDLEdBQUcsRUFBRSxTQUFTLFdBQUEsRUFBRSxLQUFLLE9BQUEsRUFBRSxDQUFDO3lCQUNqRDt3QkFFSyxTQUFTLEdBQUcsaUJBQUksQ0FBQyxJQUFJLENBQUM7NEJBQzFCLE9BQU8sRUFBRSxPQUFPOzRCQUNoQixJQUFJLEVBQUUsZUFBZTs0QkFDckIsUUFBUSxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxTQUFTLENBQUMsQ0FBQzt5QkFDaEQsQ0FBQyxDQUFDO3dCQUVILHFCQUFNLEdBQUcsQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDLEVBQUE7O3dCQUE5QixTQUE4QixDQUFDO3dCQUMvQixxQkFBTSxHQUFHLENBQUMsU0FBUyxDQUFDLE9BQU8sRUFBRSxTQUFTLENBQUMsRUFBQTs7d0JBQXZDLFNBQXVDLENBQUM7d0JBQ3hDLHNCQUFPLE9BQU8sRUFBQzs7OztLQUNoQjtJQUVNLHdCQUFjLEdBQXJCLFVBQXNCLFNBQVMsRUFBRSxTQUFTO1FBQ3hDLElBQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBQzNDLElBQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLFFBQVEsQ0FBQyxDQUFDO1FBQzdDLElBQUksQ0FBQyxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsSUFBSSxlQUFlLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRTtZQUN0RCxPQUFPLEtBQUssQ0FBQztTQUNkO1FBRUQsSUFBTSxRQUFRLEdBQUcsU0FBUyxDQUFDLENBQUMsQ0FBQyxPQUFLLFNBQVMsZUFBWSxDQUFDLENBQUMsQ0FBQyxhQUFhLENBQUM7UUFDeEUsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxRQUFRLENBQUMsQ0FBQztJQUN4QyxDQUFDO0lBQ0gsZ0JBQUM7QUFBRCxDQUFDLEFBakNELElBaUNDIn0=