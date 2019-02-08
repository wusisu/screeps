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

var isFullOfEnergy = function(creep) {
    return _.sum(creep.carry) === creep.carryCapacity
}

var hasNoneEnergy = function(creep) {
    return _.sum(creep.carry) === 0
}

var isMoreThan = function(room, role, count) {
    var creeps = room.find(FIND_CREEPS, {filter: roleFilter(role)})
    return creeps.length > count
}

module.exports = {
    walk,
    roleFilter,
    isFullOfEnergy,
    hasNoneEnergy,
    isMoreThan,
};