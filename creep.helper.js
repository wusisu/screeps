var _ = require('lodash')

var walk = function(creep) {
    if (creep.memory.target && creep.memory.walking) {
        var target = Game.getObjectById(creep.memory.target)
        if (creep.pos.isNearTo(target)) {
            creep.memory.walking = null
            return false
        }
        var ret = creep.moveTo(target)
        if (ret !== OK && ret !== ERR_TIRED) creep.say('ret' + ret + 'walk failed')
        return ret === OK
    }
}

var roleFilter = function(role) {
    return function(c) {
        if (!c.memory) return false
        return c.memory.role === role
    }
}

var isFullOfEnergy = function(creep, diff) {
    diff = diff || 0
    return _.sum(creep.carry) + diff >= creep.carryCapacity
}

var hasNoneEnergy = function(creep) {
    return _.sum(creep.carry) === 0
}

var isMoreThan = function(room, role, count) {
    var creeps = room.find(FIND_CREEPS, {filter: roleFilter(role)})
    return creeps.length > count
}

var withdrawTarget = function(creep) {
    var target = creep.pos.findClosestByPath(FIND_STRUCTURES, { 
        filter: function(s) {
            return s.structureType === STRUCTURE_CONTAINER &&
            _.sum(s.store) > 0
        }
    })
    if (target) {
        creep.memory.cache = target.id
    }
    return target
}

module.exports = {
    walk,
    roleFilter,
    isFullOfEnergy,
    hasNoneEnergy,
    isMoreThan,
    withdrawTarget,
};