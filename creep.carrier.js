var _ = require('lodash')
var helper = require('creep.helper')

var pickup = function(creep) {
    if (helper.isFullOfEnergy(creep)) {
        creep.memory.task = 'transfer'
        creep.say('transfer')
        transfer(creep)
        return
    }
    var target = Game.getObjectById(creep.memory.energy)
    if (!target) {
        target = creep.pos.findClosestByPath(FIND_DROPPED_RESOURCES);
        if (!target) {
            if (!helper.hasNoneEnergy(creep)) creep.memory.task = 'transfer'
            return
        }
        creep.memory.energy = target.id
    }
    if(creep.pickup(target) == ERR_NOT_IN_RANGE) {
        creep.moveTo(target);
    }
}

var transfer = function(creep) {
    if (helper.hasNoneEnergy(creep)) {
        creep.memory.task = 'pickup'
        creep.say('pickup')
        return pickup(creep)
        return
    }
    var target = Game.getObjectById(creep.memory.cache)
    if (!target) {
        target = creep.pos.findClosestByPath(FIND_MY_SPAWNS);
        if (!target) return
        creep.memory.cache = target.id
    }
    var ret = creep.transfer(target, RESOURCE_ENERGY)
    if(ret == ERR_NOT_IN_RANGE) {
        creep.moveTo(target);
    }
}

module.exports = {
    run: function runCarry(creep) {
        if (creep.memory.task === 'transfer') {
            return transfer(creep)
        }
        return pickup(creep)
    }
}