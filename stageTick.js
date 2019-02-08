var prefer = require('prefer')
var creepHelper = require('creep.helper')
var harvesterHelper = require('creep.harvester.helper')
var constants = require('constants')

var hasSomeCreeps = function(stage, role, count) {
    return function(room) {
        var creeps = room.find(FIND_CREEPS, {filter: creepHelper.roleFilter(role)})
        return creeps.length >= count ? null : stage
    }
}

var waitForLevel = function(stage, level) {
    return function(room) {
        return room.controller.level >= level ? null : stage
    }
}

var stageDetermines = [
    hasSomeCreeps('SPAWN-1-HARVESTER', 'harvester', 1),
    hasSomeCreeps('SPAWN-1-CARRIER', 'carrier', 1),
    hasSomeCreeps('SPAWN-1-UPDATER', 'updater', 1),
    function(room) {
        var fulfill = harvesterHelper.fulfill(room, 1)
        return fulfill ? null : 'HARVESTER-EACH-SOURCE'
    },
    hasSomeCreeps('SPAWN-3-BUILDER', 'builder', 3),
    function(room) {
        var containers = room.find(FIND_STRUCTURES, { filter: { structureType: STRUCTURE_CONTAINER }})
        return containers.length > 0 ? null : 'BUILD-1-CONTAINER'
    },
    hasSomeCreeps('SPAWN-3-UPDATER', 'updater', 3),
    waitForLevel('WAIT-FOR-LEVEL-2', 2),
    waitForLevel('WAIT-FOR-LEVEL-3', 3),
    function(room) {
        return 'END'
    }
]

var updateStage = function() {
    var stage = null
    var room = Game.rooms[prefer.myRoom]
    for (var index in stageDetermines) {
        var func = stageDetermines[index]
        stage = func(room)
        if (stage) break
    }
    console.log('update stage to ' + stage)
    Memory.stage = _stage = stage
}

var tick = function() {
    updateStage()
}

module.exports = {
    tick,
};