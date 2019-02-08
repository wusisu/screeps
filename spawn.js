/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('spawn');
 * mod.thing == 'a thing'; // true
 */
 var levelOne = require('spawn.main')

module.exports = {
    run: function (spawn) {
        return levelOne.run(spawn)
        switch(spawn.room.controller.level) {
            case 1:
                levelOne.run(spawn)
                break
            default:
                console.log('no runner for room controller of level ' + spawn.room.controller.level)
        }
    }
}