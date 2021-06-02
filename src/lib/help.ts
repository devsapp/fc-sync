export default [
  {
    header: 'Sync',
    content: 'Sync',
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
      {
        name: 'trigger-name',
        description: 'Pass in trigger name in cli mode',
        type: String,
      },
      {
        name: 'help',
        description: 'Help for fc-sync.',
        alias: 'h',
        type: Boolean,
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
    ],
  },
  {
    header: 'CLI Examples',
    content: [
      '$ s cli fc-sync --region * --service-name * --type all',
    ],
  },
];