## 组件说明

fc-sync 用于同步远端函数计算资源的配置/代码至本地

## 具体用法

### s cli 方式

```
$ s cli fc-sync sync --code --service-name ${serviceName} --function-name ${functionName} --region ${region} --target-dir ${targetDir}
```

### 应用编排使用方式

查看 example下 s.yaml


