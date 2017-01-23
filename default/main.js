var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var creeepCreate = require('creep.create')

var INTERVAL_CREATE_CREEP = 8

module.exports.loop = function () {

    var Spawn = Game.spawns['Spawn1']

    if (!Spawn.memory.last_create_creep ||
        Spawn.memory.last_create_creep > INTERVAL_CREATE_CREEP) {
        Spawn.memory.last_create_creep = 1
        creeepCreate.do(Spawn)
    }
    Spawn.memory.last_create_creep++;

    for(var name in Game.creeps) {
        var creep = Game.creeps[name];

        if(creep.memory.role == 'harvester') {
            roleHarvester.run(creep);
        }
        else if(creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
        }
        else if(creep.memory.role == 'builder') {
            roleBuilder.run(creep);
        }
    }

}
