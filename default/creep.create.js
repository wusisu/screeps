var SPAWN_TEMPLATE = {
    creeps: [
        ['harvester', 3],
        ['upgrader', 5],
        ['builder', 1],
    ]
}

var creepCreate = {
    do : function(Spawn) {

        // console.log('do creepCreate')


        //Memory clean
        for (var name in Memory.creeps) {
            if (!Game.creeps[name]) {
                delete Memory.creeps[name];
            }
        }

        var aliveCreepCount = {}

        for(var name in Game.creeps) {
            var creep = Game.creeps[name];
            if (!creep) {
                delete Memory.creeps[name];
                continue;
            }

            aliveCreepCount[creep.memory.role] = aliveCreepCount[creep.memory.role] ? aliveCreepCount[creep.memory.role] + 1 : 1;
        }

        // console.log(JSON.stringify(aliveCreepCount))

        for(index in SPAWN_TEMPLATE.creeps) {
            var item = SPAWN_TEMPLATE.creeps[index]
            var role = item[0]
            var targetCount = item[1]
            var alive = aliveCreepCount[role]
            if (!alive || alive < targetCount) {
                var name = Spawn.createCreep(['work', 'carry', 'move'], undefined, {role})
                if(typeof name != 'number') {
                    console.log('creep role:' + role + ' name: ' + name + ' is creating.')
                }
            }
        }
    }
}

module.exports = creepCreate
