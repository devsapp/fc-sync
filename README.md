## 组件说明

fc-sync 用于同步远端函数计算资源的配置/代码至本地

## 具体用法

### s cli 方式

```
$ s cli fc-sync sync --region ${region} --service-name ${serviceName} --function-name ${functionName} --target-dir ${targetDir} --type all
```

## 参数说明

type 参数来区分是否是同步代码
- type 值为 code， 则仅同步代码
- type 值为 config 仅同步配置
- type 值为 all 同步代码和配置

target-dir 指定代码包存放位置，当未指定 --target-dir 时，会将 code 默认存在当前目录中

参数组合：
- 只有 --region、--service-name，导出服务、所有函数、触发器， 不支持 --type code
- --region、 --service-name、  --function-name，导出服务、指定函数、触发器
