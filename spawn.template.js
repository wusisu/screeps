var _ = require('lodash')
var helper = require('creep.helper')
var stage = require('stage')

var getBasicTemplate = function(role) {
    switch(role) {
        case 'harvester':
            return [WORK, WORK, CARRY, MOVE]
        case 'updater':
        case 'builder':
        case 'carrier':
        default:
            return [WORK, CARRY, MOVE, MOVE]
    }
}

var COST = {
    [MOVE]: 50,
    [WORK]: 100,
    [CARRY]: 50,
}

var TEMPLATE_BUILDERS = {
    harvester: function(energyLimit) {
        var energy = 100
        var weight = 2
        var template = [CARRY, MOVE]
        while(true) {
            if (energyLimit - energy < 100) return template
            weight += 1
            energy += 100
            template.push(WORK)
        }
    },
    updater: function(energyLimit) {
        var energy = 100
        var weight = 2
        var template = [CARRY, MOVE]
        while(true) {
            if (energyLimit - energy < 100) return template
            weight += 1
            energy += 100
            template.push(WORK)
        }
    },
    builder: function(energyLimit) {
        var energy = 200
        var weight = 3
        var template = [CARRY, MOVE, WORK]
        while(true) {
            var rest = energyLimit - energy
            if (rest < 50) return template
            if (rest < 100) return template
            if (rest < 200) {
                energy += 100
                weight += 2
                template.push(...[CARRY, MOVE])
                return template
            }
            energy += 200
            weight += 3
            template.push(...[CARRY, MOVE, WORK])
        }
    },
    carrier: function(energyLimit) {
        var energy = 100
        var weight = 2
        var template = [CARRY, MOVE]
        while(true) {
            var rest = energyLimit - energy
            if (rest < 100) return template
            energy += 100
            weight += 2
            template.push(...[CARRY, MOVE])
        }
    },
}

var getTemplateWithEnergyLimit = function(spawn, role, energyLimit) {
    var roleHandler = TEMPLATE_BUILDERS[role]
    if (!roleHandler) roleHandler = TEMPLATE_BUILDERS['carrier']
    var template = roleHandler(energyLimit)
    return template
}

var getTemplate = function(spawn, role) {
    if (stage.after('BASIC')) {
        return getBasicTemplate(role)
    }
    var carriers = spawn.room.find(FIND_CREEPS, { filter: helper.roleFilter('carrier')})
    var harvesters = spawn.room.find(FIND_CREEPS, { filter: helper.roleFilter('harvester')})
    var extensions = spawn.room.find(FIND_MY_STRUCTURES, { filter: {structureType: STRUCTURE_EXTENSION}})
    var energyLimit = _.min([
        carriers.length * 400,
        extensions.length * 50 + 300,
        harvesters.length * 300,
    ])
    return getTemplateWithEnergyLimit(spawn, role, energyLimit)
}

module.exports = {
    getTemplate,
}
