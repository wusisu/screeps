/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('constants');
 * mod.thing == 'a thing'; // true
 */

var STAGES = [
    'INITIAL',
    'SPAWN-1-HARVESTER',
    'SPAWN-1-CARRIER',
    'SPAWN-1-UPDATER',
    'BASIC',
    'HARVESTER-EACH-SOURCE',
    'SPAWN-3-BUILDER',
    'BUILD-1-CONTAINER',
    'SPAWN-3-UPDATER',
    'WAIT-FOR-LEVEL-2',
    'BUILD-5-EXTENTION',
    'WAIT-FOR-LEVEL-3',
    'BUILD-10-EXTENTION',
    'BUILD-STORAGE',
    'END',
]

module.exports = {
    STAGES,
};