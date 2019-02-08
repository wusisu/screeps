var moduleSpawn = require('spawn')
var moduleCreep = require('creep')
var tick = require('helper.tick')

module.exports.loop = function () {
    for (var spawn in Game.spawns) {
        moduleSpawn.run(Game.spawns[spawn])
    }
    for (var creep in Game.creeps) {
        moduleCreep.run(Game.creeps[creep])
    }
    tick.register('stageTick', 100)
    tick.tick()
}