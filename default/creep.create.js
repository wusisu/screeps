const SPAWN_TEMPLATE = {
    creeps: [
        ['harvester', 2],
        ['upgrader', 8],
        ['builder', 2],
    ]
}

//至少需要存在一个 age tick 以上的 harvester
const HARVESTER_HEALTHY_AGE = 300;

exports.create = function(Spawn, role) {
    var name = role + '-' + new Date().getTime()
    var ret = Spawn.createCreep(['work', 'carry', 'move'], name, {role})
    console.log('creep role:' + role + ' name: ' + name + ' is creating. and ret is ' + ret)
}

exports.do = function(Spawn) {
    //Memory clean
    for (var name in Memory.creeps) {
        if (!Game.creeps[name]) {
            delete Memory.creeps[name];
        }
    }

    harvesterAgeHealth = false;

    var aliveCreepCount = {}

    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        aliveCreepCount[creep.memory.role] = aliveCreepCount[creep.memory.role] ? aliveCreepCount[creep.memory.role] + 1 : 1;
        harvesterAgeHealth = harvesterAgeHealth || creep.memory.role === 'harvester' && creep.ticksToLive > HARVESTER_HEALTHY_AGE
    }

    if (!harvesterAgeHealth) {
        return exports.create(Spawn, role)
    }

    // console.log(JSON.stringify(aliveCreepCount))

    for(index in SPAWN_TEMPLATE.creeps) {
        var item = SPAWN_TEMPLATE.creeps[index]
        var role = item[0]
        var targetCount = item[1]
        var alive = aliveCreepCount[role]
        if (!alive || alive < targetCount) {
            return exports.create(Spawn, role)
        }
    }
}
