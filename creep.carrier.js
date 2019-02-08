var _ = require('lodash')
var helper = require('creep.helper')

var TASK_WITHDRAW = 'withdraw'
var TASK_TRANSFER = 'transfer'
var TASK_PICKUP = 'pickup'

var withdraw = function(creep, changeJob) {
    if (changeJob) creep.memory.task = TASK_WITHDRAW
    if (helper.isFullOfEnergy(creep)) {
        return think(creep)
    }
    var target = Game.getObjectById(creep.memory.cache)
    if (!target) {
        target = helper.withdrawTarget(creep)
    }
    var ret = creep.withdraw(target, RESOURCE_ENERGY)
    if (ret === ERR_NOT_IN_RANGE) {
        creep.moveTo(target)
    } else if (ret === ERR_NOT_ENOUGH_ENERGY) {
        creep.memory.target = null
        return think(creep)
    } else {
        creep.say(ret)
    }
}

var pickup = function(creep, changeJob) {
    if (changeJob) creep.memory.task = TASK_PICKUP
    if (helper.isFullOfEnergy(creep)) {
        return think(creep)
    }
    var target = Game.getObjectById(creep.memory.energy)
    if (!target) {
        target = creep.pos.findClosestByPath(FIND_DROPPED_RESOURCES);
        if (!target) {
            if (!helper.hasNoneEnergy(creep)) creep.memory.task = TASK_TRANSFER
            return
        }
        creep.memory.energy = target.id
    }
    if(creep.pickup(target) == ERR_NOT_IN_RANGE) {
        creep.moveTo(target);
    }
}

var transferTarget = function(creep) {
    var spawn = creep.room.find(FIND_MY_SPAWNS)[0]
    if (spawn.energy < spawn.energyCapacity) {
        return spawn
    }
    var containers = creep.room.find(FIND_STRUCTURES, { 
        filter: function(c) {
            c.structureType === STRUCTURE_CONTAINER &&
            _.sum(c.store) < c.storeCapacity
        }
    })
    containers = _.sortBy(containers, function(c) {
        return PathFinder.search(creep.pos, c).cost
    })
    return containers[0]
}

var transfer = function(creep, changeJob) {
    if (changeJob) creep.memory.task = TASK_TRANSFER
    if (helper.hasNoneEnergy(creep)) {
        creep.memory.cache = null
        return think(creep)
    }
    var target = Game.getObjectById(creep.memory.cache)
    if (!target) {
        target = transferTarget(creep)
        if (!target) return
        creep.memory.cache = target.id
    }
    var ret = creep.transfer(target, RESOURCE_ENERGY)
    if (ret === ERR_NOT_IN_RANGE) {
        creep.moveTo(target);
    } else if (ret === ERR_FULL) {
        creep.memory.cache = null
        return think(creep)
    }
}

var think = function(creep) {
    var spawn = creep.room.find(FIND_MY_SPAWNS)[0]
    if (spawn.energy < spawn.energyCapacity) {
        if (!helper.hasNoneEnergy(creep)) {
            return transfer(creep, true)
        }
        return withdraw(creep, true)
    }
    if (helper.isFullOfEnergy(creep)) {
        return transfer(creep, true)
    }
    return pickup(creep, true)
}

module.exports = {
    run: function runCarry(creep) {
        switch(creep.memory.task) {
            case TASK_TRANSFER:
            return transfer(creep)
            case TASK_PICKUP:
            return pickup(creep)
            case TASK_WITHDRAW:
            return withdraw(creep)
            default:
            return think(creep)
        }
    }
}