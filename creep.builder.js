var helper = require('creep.helper')
var stage = require('stage')
var _ = require('lodash')

var TASK_WITHDRAW = 'withdraw'
var TASK_BUILDING = 'building'
var TASK_FIX = 'fix'

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
    // console.log('next to build', sites[0])
    return sites[0]
}

var shouldSleep = function(creep) {
    if (!stage.shouldRun('SPAWN-3-BUILDER')) {
        if (helper.isMoreThan(creep.room, 'builder', 1)) {
            creep.say('b2c')
            creep.memory.role = 'carrier'
            return
        }
        creep.say('stopped')
        return
    }
    return true
}

var build = function(creep, changeJob) {
    if (changeJob) creep.memory.task = TASK_BUILDING
    if (helper.hasNoneEnergy(creep)) {
        return think(creep)
    }
    if (!shouldSleep(creep)) return
    var building = Game.getObjectById(creep.memory.target)
    if (!building) {
        building = nextToBuild(creep)
        if (building) creep.memory.target = building.id
    }
    if (!building) {
        return fix(creep, true)
    }
    var ret = creep.build(building)
    if (ret === ERR_NOT_IN_RANGE) {
        creep.moveTo(building)
    } else if (ret === ERR_INVALID_TARGET) {
        creep.memory.target = null
    } else if (ret !== OK) {
        creep.say(ret)
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

var withdraw = function(creep, changeJob) {
    if (changeJob) creep.memory.task = TASK_WITHDRAW
    if (helper.isFullOfEnergy(creep)) {
        return think(creep)
    }
    var cache = ensureCache(creep)
    if (!cache) return
    var ret = creep.withdraw(cache, RESOURCE_ENERGY)
    if (ret === ERR_NOT_IN_RANGE) {
        creep.moveTo(cache)
    } else if (ret !== OK) {
        creep.say(ret)
    }
}

var shouldFix = function(creep, rate, type) {
    return creep.room.find(FIND_STRUCTURES, {
        filter: function(s) {
            return s.hits * 1.0 / s.hitsMax < rate && 
            (!type || type === s.structureType)
        }
    })
}

var fix = function(creep, changeJob) {
    if (changeJob) creep.memory.task = TASK_FIX
    if (helper.hasNoneEnergy(creep)) {
        return think(creep)
    }
    if (!shouldSleep(creep)) return
    var target = Game.getObjectById(creep.memory.target)
    if (!target) {
        var containers = shouldFix(creep, 0.2, STRUCTURE_CONTAINER)
        if (containers[0]) target = containers[0]
        if (!target) {
            var fixALL = shouldFix(creep, 0.6)
            if (fixALL[0]) {
                fixALL.sort((a,b) => a.hits - b.hits);
                target = fixALL[0]
            }
        }
        if (target) creep.memory.target = target.id
    }
    if (!target) {
        creep.memory.task = null
        return
    }
    var ret = creep.repair(target)
    if (target.hits >= target.hitsMax) {
        return think(creep)
    }
    if (ret === ERR_NOT_IN_RANGE) {
        creep.moveTo(target)
    } else if (ret !== OK) {
        creep.say(ret)
    }
}

var think = function(creep) {
    creep.memory.target = null
    creep.memory.cache = null
    if (helper.hasNoneEnergy(creep)) {
        return withdraw(creep, true)
    }
    var fixContainer = shouldFix(creep, 0.1, STRUCTURE_CONTAINER)
    if (fixContainer[0]) return fix(creep, true)
    return build(creep, true)
}

var run = function(creep) {
    switch(creep.memory.task) {
        case TASK_BUILDING:
        return build(creep)
        case TASK_WITHDRAW:
        return withdraw(creep)
        case TASK_FIX:
        return fix(creep)
        default:
        return think(creep)
    }
}

module.exports = {
    run,
};