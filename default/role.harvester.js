const creepWorkerCommon = require('./creep.worker.common')

var roleHarvester = {

    /** @param {Creep} creep **/
    run: function(creep) {
	    if(creep.carry.energy < creep.carryCapacity) {
            creepWorkerCommon.getResource(creep)
        }
        else {
            var targets = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN) &&
                            structure.energy < structure.energyCapacity;
                    }
            });
            console.log(targets)
            if(targets.length > 0) {
                if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0]);
                }
            }else {
                targets = creep.room.find(FIND_STRUCTURES, {
                    filter: s => s.structureType == STRUCTURE_SPAWN
                })
                console.log('harvesting is boring and go home ', targets.length)
                if (targets.length)
                    creep.moveTo(targets[0]);
            }
        }
	}
};

module.exports = roleHarvester;
