var _ = require('lodash')
var helper = require('creep.helper')
var stage = require('stage')
var harvesterHelper = require('creep.harvester.helper')
var templateHelper = require('spawn.template')


var doSpawnCreep = function(spawn, role, opt) {
    var name = role + '-' + new Date().getTime()
    var template = templateHelper.getTemplate(spawn, role, opt)
    var testIfCanSpawn = spawn.spawnCreep(template, name, {
        dryRun: true,
    })
    if (testIfCanSpawn == OK) {
        var ret = spawn.spawnCreep(template, name, {
            memory: {role},
        });
        if (ret == OK) {
            console.log('spawning creep: ' + name, template)
        } else {
            console.log('try to spawn creep and got error: ' + ret)
        }
    }
}

var shouldEnsureCreeps = function(stageLimit, role, count, basic) {
    return function(spawn) {
        // console.log(stageLimit, role, count)
        if (!stage.shouldRun(stageLimit)) return false
        var creeps = spawn.room.find(FIND_CREEPS, {filter: helper.roleFilter(role)})
        if (creeps.length >= count) return false
        if (basic) {
            doSpawnCreep(spawn, role, {energe: 300})
        } else {
            doSpawnCreep(spawn, role)
        }
        return true    
    }
}

var shouldMakeupCarrier = function(spawn) {
    if (!stage.shouldRun('HARVESTER-EACH-SOURCE')) return false
    var creeps = spawn.room.find(FIND_CREEPS, {filter: helper.roleFilter('harvester')})
    var creepsCarrier = spawn.room.find(FIND_CREEPS, {filter: helper.roleFilter('carrier')})
    if (creepsCarrier.length >= creeps.length) return false
    doSpawnCreep(spawn, 'carrier')
    return true
}

var shouldEnsureFulfillHarvester = function(spawn) {
    if (!stage.shouldRun('HARVESTER-EACH-SOURCE')) return false
    var ret = shouldMakeupCarrier(spawn)
    if (ret) return true
    var fulfill = harvesterHelper.fulfill(spawn.room)
    if (fulfill) return false
    doSpawnCreep(spawn, 'harvester')
    return true
}

var ensureList = [
    shouldEnsureCreeps('SPAWN-1-HARVESTER', 'harvester', 1, true),
    shouldEnsureCreeps('SPAWN-1-CARRIER', 'carrier', 1, true),
    shouldEnsureCreeps('SPAWN-1-UPDATER', 'updater', 1, true),
    shouldEnsureFulfillHarvester,
    shouldEnsureCreeps('SPAWN-1-BUILDER', 'builder', 1),
    shouldEnsureCreeps('SPAWN-1-BUILDER', 'updater', 2),
]

var spawnCreep = function(spawn) {
    for (var i in ensureList) {
        var func = ensureList[i]
        if (func(spawn)) return
    }
}

module.exports = {
    run: function(spawn) {
        spawnCreep(spawn)
    }
};