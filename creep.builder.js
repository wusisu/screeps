var helper = require('creep.helper')
var stage = require('stage')
var _ = require('lodash')

var STRUCTURES = [
    STRUCTURE_SPAWN,
    STRUCTURE_EXTENSION,
    STRUCTURE_CONTAINER,
    STRUCTURE_STORAGE,
    STRUCTURE_TOWER,

    STRUCTURE_ROAD,

    STRUCTURE_RAMPART,
    STRUCTURE_KEEPER_LAIR,
    STRUCTURE_PORTAL,
    STRUCTURE_CONTROLLER,
    STRUCTURE_LINK,
    STRUCTURE_OBSERVER,
    STRUCTURE_POWER_BANK,
    STRUCTURE_POWER_SPAWN,
    STRUCTURE_EXTRACTOR,
    STRUCTURE_LAB,
    STRUCTURE_TERMINAL,
    
    STRUCTURE_NUKER,
    STRUCTURE_WALL,
]

var nextToBuild = function(creep) {
    var sites = creep.room.find(FIND_MY_CONSTRUCTION_SITES)
    sites = _.sortBy(sites, function(s) {
        return 1 - s.progress * 1.0 / s.progressTotal + STRUCTURES.indexOf(s.structureType)
    })
    // console.log(sites[0])
    return sites[0]
}

var build = function(creep) {
    if (!stage.shouldRun('SPAWN-3-BUILDER')) {
        if (helper.isMoreThan(creep.room, 'builder', 1)) {
            creep.say('b2c')
            creep.memory.role = 'carrier'
            return
        }
        creep.say('stopped')
        return
    }
    var building = Game.getObjectById(creep.memory.target)
    if (!building) {
        building = nextToBuild(creep)
        if (building) creep.memory.target = building.id
    }
    if (!building) {
        creep.say('no building!')
    }
    var ret = creep.build(building)
    if (ret === ERR_NOT_IN_RANGE) {
        creep.moveTo(building)
    } else if (ret === ERR_INVALID_TARGET) {
        creep.memory.target = null
    }
    if (helper.hasNoneEnergy(creep)) {
        creep.memory.task = 'withdraw'
        creep.memory.target = null
    }
}

var ensureCache = function(creep) {
    if (!creep.memory || !creep.memory.cache) {
        var cache = helper.withdrawTarget(creep)
        if (!cache) {
            creep.say('no cache')
            return
        }
        creep.memory.cache = cache.id
    }
    return Game.getObjectById(creep.memory.cache)
}

var withdraw = function(creep) {
    var cache = ensureCache(creep)
    if (!cache) return
    var ret = creep.withdraw(cache, RESOURCE_ENERGY)
    if (ret === ERR_NOT_IN_RANGE) {
        creep.moveTo(cache)
    }
    if (helper.isFullOfEnergy(creep)) {
        creep.memory.task = 'building'
        creep.memory.cache = null
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