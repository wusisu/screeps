var helper = require('creep.helper')
var stage = require('stage')

var build = function(creep) {
    if (!stage.shouldRun('SPAWN-3-BUILDER')) {
        creep.say('stopped')
        return
    }
    var building = creep.room.find(FIND_CONSTRUCTION_SITES)[0]
    if (!building) {
        creep.say('no building!')
    }
    var ret = creep.build(building)
    if (ret === ERR_NOT_IN_RANGE) {
        creep.moveTo(building)
    }
    if (helper.hasNoneEnergy(creep)) {
        creep.memory.task = 'withdraw'
    }
}

var ensureCache = function(creep) {
    if (!creep.memory || !creep.memory.cache) {
        var cache = creep.room.find(FIND_MY_SPAWNS)[0]
        if (!cache) {
            console.log('no cache ?')
        }
        creep.memory.cache = cache.id
    }
    return Game.getObjectById(creep.memory.cache)
}

var withdraw = function(creep) {
    var cache = ensureCache(creep)
    var ret = creep.withdraw(cache, RESOURCE_ENERGY)
    if (ret === ERR_NOT_IN_RANGE) {
        creep.moveTo(cache)
    }
    if (helper.isFullOfEnergy(creep)) {
        creep.memory.task = 'building'
    }
}

var run = function(creep) {
    if (creep.memory.task === 'building') {
        return build(creep)
    }
    return withdraw(creep)
}

module.exports = {
    run,
};