const creepWorkerCommon = require('./creep.worker.common')

exports.changeJob = function(creep, job) {
    creep.memory.job = job
    creep.say(job)
}

var jobs = {
    collecting: function(creep) {
        if(creep.carry.energy < creep.carryCapacity) {
            creepWorkerCommon.getResource(creep)
        }else {
            exports.changeJob(creep, 'charging');
        }
    },
    charging: function(creep) {
        if (creep.carry.energy > 0) {
            var targets = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN) &&
                            structure.energy < structure.energyCapacity;
                    }
            });
            if(targets.length > 0) {
                var target = targets[0]
                if(targets.length > 1) {
                    target = targets[1]
                }
                if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target);
                }
            }else {
                targets = creep.room.find(FIND_STRUCTURES, {
                    filter: s => s.structureType == STRUCTURE_SPAWN
                })
                // console.log('harvesting is boring and go home ', targets.length)
                if (targets.length)
                    creep.moveTo(targets[0]);
            }
        }else {
            exports.changeJob(creep, 'collecting')
        }
    },
}
exports.doJob = function(creep) {
    var job = jobs[creep.memory.job]
    if (job) {
        return job(creep)
    }
    exports.changeJob(creep, 'collecting')
}

exports.run = function(creep) {
    exports.doJob(creep)
}
