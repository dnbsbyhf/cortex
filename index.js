'use strict';


var cortex = module.exports = {};

var COMMANDS = cortex.COMMANDS = [
    'install',
    'validate',
    'build'
];

cortex.commands = {};
cortex.opts = {};

COMMANDS.forEach(function(command) {

    // cortex.commands[command](options)
    cortex.commands[command] = require('./lib/command/' + command);
    cortex.opts[command] = require('./lib/option/' + command);
});

cortex.commander = require('./lib/commander');
cortex.logger = require('./lib/logger');

