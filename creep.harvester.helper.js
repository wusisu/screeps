var prefer = require('prefer')
var creepHelper = require('creep.helper')
var stage = require('stage')

var findSource = function(creep) {
    var spawn = creep.room.find(FIND_MY_SPAWNS)[0]
    var sources = creep.room.find(FIND_SOURCES)
}

var ensureSource = function(creep) {
    if (!creep.memory || !creep.memory.source) {
        var binding = sourceBinding(creep.room)
        var sourcePfs = sourcePrefer(creep.room)
        if (!sourcePfs) return
        for (var sourceId in sourcePfs) {
            var sourcePf = sourcePfs[sourceId]
            var preferCount = sourcePf.creeps
            var actualCount = binding[sourceId] || 0
            creep.say('source')
            if (preferCount > actualCount) {
                creep.memory.source = sourceId
                break
            }
        }
    }
    return Game.getObjectById(creep.memory.source)
}

var ensureCache = function(creep) {
    if (!creep.memory || !creep.memory.cache) {
        var cache = null
        if (!stage.shouldRun('SPAWN-3-UPDATER')) {
            cache = creep.room.find(FIND_MY_SPAWNS)[0]
        } else {
            var source = ensureSource(creep)
            var sourcePf = sourcePrefer(creep.room)[source.id]
            cache = sourcePf.cache
        }
        if (!cache) {
            console.log('no prefer cache ?')
        }
        creep.memory.cache = cache.id
    }
    return Game.getObjectById(creep.memory.cache)
}

var sourcePrefer = function(room) {
    var preferRoom = prefer.rooms[room.name]
    if (!preferRoom || !preferRoom.sources) {
        console.log('no prefer for room ' + room.name)
        return null
    }
    return preferRoom.sources
}

var sourceBinding = function(room) {
    var creeps = room.find(FIND_CREEPS, {filter: creepHelper.roleFilter('harvester')})
    var binding = _.reduce(creeps, function(result, creep, creepName) {
        if (!creep.memory || !creep.memory.source) return result
        var source = creep.memory.source
        if (!result[source]) result[source] = 0
        result[source] += 1
        return result
    }, {})
    return binding
}

var fulfill = function(room) {
    var binding = sourceBinding(room)
    var sourcePfs = sourcePrefer(room)
    if (!sourcePfs) return
    for (var sourceId in sourcePfs) {
        var sourcePf = sourcePfs[sourceId]
        var preferCount = sourcePf.creeps
        var actualCount = binding[sourceId] || 0
        if (preferCount > actualCount) {
            return false
        }
    }
    return true
}

module.exports = {
    findSource,
    ensureSource,
    sourceBinding,
    fulfill,
    ensureCache,
};