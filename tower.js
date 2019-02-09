var _ = require('lodash')
var helper = require('helper')

var TASK_ATTACK = 'attack'
var TASK_HEAL = 'heal'
var TASK_REPAIR = 'repair'

var THINK_EVERY_TICKS = 30

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
    
    tower.pos.find
    var energyRate = helper.energyRate(tower)
    
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