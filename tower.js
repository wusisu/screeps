var _ = require('lodash')
var helper = require('helper')

var TASK_ATTACK = 'attack'
var TASK_HEAL = 'heal'
var TASK_REPAIR = 'repair'

var THINK_EVERY_TICKS = 30

var attackTarget = function(tower) {
    return tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS)
}

var healTarget = function(tower) {
    return tower.pos.findClosestByRange(FIND_MY_CREEPS, {
        filter: function(c) {
            return c.hits < c.hitsMax
        }
    })
}

var repairTarget = function(tower) {
    return tower.pos.findClosestByRange(FIND_STRUCTURES, {
        filter: function(c) {
            return c.hits < c.hitsMax * 0.5
        }
    })
}

var attack = function(tower) {
    if (!tower.memory.task) tower.memory.task = TASK_ATTACK
}

var heal = function(tower) {
    if (!tower.memory.task) tower.memory.task = TASK_HEAL
}

var repair = function(tower) {
    if (!tower.memory.task) tower.memory.task = TASK_REPAIR
}

var think = function(tower) {
    tower.memory.task = null
    tower.memory.target = null
    var target = attackTarget(tower)
    var energyRate = helper.energyRate(tower)
    if (target) return attack(tower)
    if (energyRate < 0.3) return
    target = healTarget(tower)
    if (target) return heal(tower)
    if (energyRate < 0.5) return
    target = repairTarget(tower)
    if (target) return repair(tower)
}

var step = function(tower) {
    var thinkTime = tower.memory.think || 0
    thinkTime -= 1
    if (thinkTime <= 0) {
        tower.memory.think = THINK_EVERY_TICKS
        return think()
    }
    switch(tower.memory.think) {
        case TASK_ATTACK:
        return attack(tower)
        case TASK_HEAL:
        return heal(tower)
        case TASK_REPAIR:
        return repair(tower)
        default:
        return think(tower)
    }

}

var run = function(tower) {
    return step(tower)
}

module.exports = {
    run,
}