
var _ = require('lodash')
var creepHelper = require('creep.helper')
var harvesterHelper = require('creep.harvester.helper')
var stage = require('stage')

var FINISH_COUNT = 5

var harvest = function(creep) {
    var source = harvesterHelper.ensureSource(creep)
    var ret = creep.harvest(source)
    if (ret === ERR_NOT_IN_RANGE) {
        ret = creep.moveTo(source)
    }
    if (_.sum(creep.carry) < creep.carryCapacity ||
    stage.between('SPAWN-1-UPDATER', 'BUILD-1-CONTAINER')) {
        creep.memory.task = 'harvesting'
    } else {
        creep.memory.task = 'transfer'
    }
}

var transfer = function(creep) {
    var cache = harvesterHelper.ensureCache(creep)
    ret = creep.transfer(cache, RESOURCE_ENERGY)
    if (ret === ERR_NOT_IN_RANGE) {
        ret = creep.moveTo(cache)
    }
    if (_.sum(creep.carry) === 0) {
        creep.memory.task = 'harvesting'
    }
}

var run = function(creep) {
    var source = harvesterHelper.ensureSource(creep)
    if (source === null) {} // TODO: change job
    var task = creep.memory.task
    var ret = null
    if (creep.memory.task === 'harvesting') {
        return harvest(creep)
    }
    return transfer(creep)
}

module.exports = {
    run,
};