var _ = require('lodash')
var helper = require('creep.helper')

var TASK_WITHDRAW = 'withdraw'
var TASK_TRANSFER = 'transfer'
var TASK_PICKUP = 'pickup'
var TASK_REBALANCE = 'rebalance'

var withdraw = function(creep, changeJob) {
    if (changeJob) creep.memory.task = TASK_WITHDRAW
    if (helper.isFullOfEnergy(creep)) {
        return think(creep)
    }
    var target = Game.getObjectById(creep.memory.cache)
    if (!target) {
        target = helper.withdrawTarget(creep)
    }
    if (!target) {
        return pickup(creep)
    }
    var ret = creep.withdraw(target, RESOURCE_ENERGY)
    if (ret === ERR_NOT_IN_RANGE) {
        creep.moveTo(target)
    } else if (ret === ERR_NOT_ENOUGH_ENERGY || ret === ERR_INVALID_TARGET) {
        return think(creep)
    } else if (ret !== OK) {
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
            creep.memory.task = null
            return 
        }
        creep.memory.energy = target.id
    }
    var ret = creep.pickup(target)
    if (ret === ERR_NOT_IN_RANGE) {
        creep.moveTo(target);
    } else if (ret === ERR_INVALID_TARGET) {
        return think(creep)
    } else if (ret !== OK) {
        creep.say(ret)
    }
}

var transferTarget = function(creep, emergency) {
    var tower = creep.pos.findClosestByPath(FIND_STRUCTURES, {
        filter: function(c) {
            return c.structureType === STRUCTURE_TOWER &&
            c.energy < c.energyCapacity * 0.5
        },
        range: 20
    })
    if (tower) return tower
    var spawn = creep.room.find(FIND_MY_SPAWNS)[0]
    if (spawn.energy < spawn.energyCapacity) {
        return spawn
    }
    var extension = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
        filter: function(e) {
            return e.structureType === STRUCTURE_EXTENSION &&
            e.energy < e.energyCapacity
        }
    })
    if (extension) return extension
    if (emergency) return
    var container = creep.pos.findClosestByPath(FIND_STRUCTURES, {
        filter: function(c) {
            return c.structureType === STRUCTURE_CONTAINER &&
            _.sum(c.store) < c.storeCapacity
        }
    })
    return container
}

var transfer = function(creep, changeJob) {
    if (changeJob) creep.memory.task = TASK_TRANSFER
    if (helper.hasNoneEnergy(creep)) {
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
    } else if (ret === ERR_FULL || ret === ERR_INVALID_TARGET) {
        return think(creep)
    } else if (ret !== OK) {
        creep.say(ret)
    }
}

var needRebalance = function(creep) {
    var full = creep.pos.findClosestByPath(FIND_STRUCTURES, {
        filter: function(s) {
            return s.structureType === STRUCTURE_CONTAINER &&
            _.sum(s.store) > s.storeCapacity * 0.7
        }
    })
    var empty = creep.pos.findClosestByPath(FIND_STRUCTURES, {
        filter: function(s) {
            return s.structureType === STRUCTURE_CONTAINER &&
            _.sum(s.store) < s.storeCapacity * 0.5
        }
    })
    if (!full && !empty) return null
    if (full && empty) return {full, empty}
    if (full) empty = creep.pos.findClosestByPath(FIND_STRUCTURES, {
        filter: function(s) {
            return s.structureType === STRUCTURE_STORAGE &&
            _.sum(s.store) < s.storeCapacity
        }
    });
    else {
        full = creep.pos.findClosestByPath(FIND_STRUCTURES, {
            filter: function(s) {
                return s.structureType === STRUCTURE_STORAGE &&
                _.sum(s.store) > 0
            }
        });
    }
    return {full, empty}
}

var think = function(creep) {
    creep.memory.target = null
    creep.memory.cache = null
    creep.memory.energy = null
    var emergency = transferTarget(creep, true)
    if (emergency) {
        if (!helper.hasNoneEnergy(creep)) {
            return transfer(creep, true)
        }
        return withdraw(creep, true)
    }
    var drops = creep.pos.findClosestByPath(FIND_DROPPED_RESOURCES);
    if (drops) {
        if (!helper.isFullOfEnergy(creep)) {
            return pickup(creep, true)
        }
    }
    var rebalance = needRebalance(creep)
    if (rebalance) {
        if (rebalance.full && !helper.isFullOfEnergy(creep)) {
            creep.memory.cache = rebalance.full.id
            return withdraw(creep, true)
        }
        if (rebalance.empty && !helper.hasNoneEnergy(creep)) { 
            creep.memory.cache = rebalance.empty.id
            return transfer(creep, true)
        }
    }
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