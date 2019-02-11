var creepHelper = require('creep.helper')
var stage = require('stage')

var findSource = function(creep) {
    var spawn = creep.room.find(FIND_MY_SPAWNS)[0]
    var sources = creep.room.find(FIND_SOURCES)
}

var findEmptySource = function(room) {
    var sources = room.find(FIND_SOURCES)
    var harvesters = room.find(FIND_CREEPS, {filter: creepHelper.roleFilter('harvester')})
    var assignedSourcesIds = harvesters.map(h => h.memory.source)
    var source = sources.find(s => !(assignedSourcesIds.filter(asi => asi === s.id).length > 1))
    return source
}

var fulfill = function(room) {
    return !findEmptySource(room)
}

var ensureSource = function(creep) {
    if (!creep.memory || !creep.memory.source) {
        // each soruce 2 harvester
        var source = findEmptySource(creep.room)
        if (source) {
            creep.memory.source = source.id
        }
    }
    return Game.getObjectById(creep.memory.source)
}

var ensureCache = function(creep) {
    if (!creep.memory || !creep.memory.cache) {
        var cache = null
        cache = creep.pos.findClosestByPath(FIND_STRUCTURES, { 
            filter: { structureType: STRUCTURE_CONTAINER },
            range: 5,
        })
        if (!cache) cache = creep.room.find(FIND_MY_SPAWNS)[0]
        if (!cache) {
            console.log('no cache ?')
        }
        creep.memory.cache = cache.id
    }
    return Game.getObjectById(creep.memory.cache)
}

var considerFull = function(creep) {
    if (!creep.memory.workAbility) {
        var count = creep.getActiveBodyparts(WORK)
        if (!count) count = -1
        creep.memory.workAbility = count * 2
    }
    var workAbility = creep.memory.workAbility
    return creepHelper.isFullOfEnergy(creep, workAbility)
}

module.exports = {
    findSource,
    ensureSource,
    fulfill,
    ensureCache,
    considerFull,
};