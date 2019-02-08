var _ = require('lodash')
var creepHelper = require('creep.helper')
var stage = require('stage')

var upgrade = function(creep, target) {
    if (!target) {
        target = Game.getObjectById(creep.memory.target)
    }
    var ret = creep.upgradeController(target)
    if (ret !== OK) creep.say(ret)
}

var charge = function(creep, target) {
    if (!stage.shouldRun('SPAWN-1-UPDATER')) return
    if (!target) {
        target = Game.getObjectById(creep.memory.target)
    }
    var ret = creep.withdraw(target, RESOURCE_ENERGY);
    if (ret !== OK) creep.say(ret)
}

var run = function(creep) {
    var walked = creepHelper.walk(creep)
    if (walked) return
    var target = null
    if (creep.memory.target) {
        target = Game.getObjectById(creep.memory.target)
    }
    if (_.sum(creep.carry) < creep.carryCapacity) {
        if (!(target instanceof StructureSpawn)) {
            target = creep.pos.findClosestByPath(FIND_MY_SPAWNS)
            if (target == null) return
            creep.memory.target = target.id
        }
        if (creep.pos.isNearTo(target)) {
            charge(creep, target)
            return
        }
        creep.memory.walking = true
        creepHelper.walk(creep)
        return
    }
    if (target instanceof Source) {
        target = null
    }
    target = creep.room.controller
    creep.memory.target = target.id
    if (creep.pos.isNearTo(target)) {
        upgrade(creep, target)
        return
    }
    creep.memory.walking = true
    creepHelper.walk(creep)
    return
    
}

module.exports = {
    run,
};