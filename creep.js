var creepHarvester = require('creep.harvester')
var creepUpdater = require('creep.updater')
var creepCarrier = require('creep.carrier')
var creepBuilder = require('creep.builder')

var run = function(creep) {
    switch (creep.memory.role) {
        case 'harvester':
            creepHarvester.run(creep)
            break
        case 'updater':
            creepUpdater.run(creep)
            break
        case 'carrier':
            creepCarrier.run(creep)
            break
        case 'builder':
            creepBuilder.run(creep)
            break
        default:
            console.log('no runner for creep of role ' + creep.memory.role)
    }
}

module.exports = {
    run,
};