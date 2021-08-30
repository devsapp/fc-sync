export default [
  {
    header: 'Sync',
    content: 'Synchronize online resources to offline resources.',
  },
  {
    header: 'Usage',
    content: '$ s sync <options>',
  },
  {
    header: 'Options',
    optionList: [
      {
        name: 'type',
        description: 'Operation type, code/config/all(default: all)',
        type: String,
      },
      {
        name: 'target-dir',
        description: 'Specify storage directory(default: current dir).',
        type: Boolean,
      },
      {
        name: 'force',
        description: 'Mandatory overwrite code file',
        alias: 'f',
        type: Boolean,
      },
      {
        name: 'region',
        description: 'Specify region in cli mode',
        type: String,
      },
      {
        name: 'service-name',
        description: 'Specify service name in cli mode',
        type: String,
      },
      {
        name: 'function-name',
        description: 'Specify function name in cli mode',
        type: String,
      },
    ],
  },
  {
    header: 'Global Options',
    optionList: [
      {
        name: 'access',
        description: 'Specify key alias.',
        alias: 'a',
        type: Boolean,
      },
      {
        name: 'help',
        description: 'fc-sync help for command.',
        alias: 'h',
        type: Boolean,
      },
    ],
  },
  {
    header: 'Examples with Yaml',
    content: [
      '$ s sync',
      '$ s <ProjectName> sync',
      '$ s sync --region cn-hangzhou --service-name myService',
      '$ s exec -- sync  --region cn-hangzhou --service-name myService',
    ],
  },
  {
    header: 'Examples with CLI',
    content: [
      '$ s cli fc sync --region cn-shanghai --service-name myService --type config',
    ],
  },
];
