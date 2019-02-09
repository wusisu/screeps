
var helper = require('creep.helper')
var harvesterHelper = require('creep.harvester.helper')
var stage = require('stage')

var FINISH_COUNT = 5

var harvest = function(creep) {
    var source = harvesterHelper.ensureSource(creep)
    if (harvesterHelper.considerFull(creep)) {
        if (!stage.after('SPAWN-1-CARRIER')) creep.memory.cache = creep.room.find(FIND_MY_SPAWNS)[0].id
        if (!stage.between('HARVESTER-EACH-SOURCE', 'BUILD-1-CONTAINER')) {
            creep.memory.task = 'transfer'
            creep.memory.cache = null
            return transfer(creep)
        }
    }
    var ret = creep.harvest(source)
    if (ret === ERR_NOT_IN_RANGE) {
        ret = creep.moveTo(source)
    } else if (ret === ERR_NOT_ENOUGH_ENERGY) {
        return
    } else if (ret !== OK) {
        creep.say(ret)
    }
}

var transfer = function(creep) {
    if (helper.hasNoneEnergy(creep)) {
        creep.memory.cache = null
        creep.memory.task = 'harvesting'
        return harvest(creep)
    }
    var cache = harvesterHelper.ensureCache(creep)
    ret = creep.transfer(cache, RESOURCE_ENERGY)
    if (ret === ERR_NOT_IN_RANGE) {
        ret = creep.moveTo(cache)
    } else if (ret !== OK) {
        creep.say(ret)
    }
}

var run = function(creep) {
    var source = harvesterHelper.ensureSource(creep)
    if (source === null) {} // TODO: change job
    if (creep.memory.task === 'harvesting') {
        return harvest(creep)
    }
    return transfer(creep)
}

module.exports = {
    run,
};