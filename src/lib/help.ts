export default [
  {
    header: 'Description',
    content: 'Online configuration or code download to local',
  },
  {
    header: 'Usage',
    content: '$ fc-sync sync <options>',
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
        description: 'Pass in region in cli mode',
        type: String,
      },
      {
        name: 'service-name',
        description: 'Pass in service name in cli mode',
        type: String,
      },
      {
        name: 'function-name',
        description: 'Pass in function name in cli mode',
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
      '$ s exec -- fc-sync --type all',
    ],
  },
  {
    header: 'Examples with CLI',
    content: [
      '$ s cli fc-sync --region * --service-name * --type all',
    ],
  },
];