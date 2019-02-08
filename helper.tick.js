/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('helper.tick');
 * mod.thing == 'a thing'; // true
 */

var _ticks = null

var getTicks = function() {
    if (_ticks === null) {
        _ticks = Memory.ticks;
        if (!_ticks) {
            _ticks = {}
            Memory.ticks = _ticks
        }
    }
    return _ticks
}

var getTick = function(moduleName) {
    return getTicks()[moduleName]
}

var setTick = function(moduleName, interval) {
    console.log('setTick ' + moduleName + ' ' + interval)
    var ticks = getTicks()
    ticks[moduleName] = [interval, 0]
    Memory.ticks = _ticks = ticks
}

var save = function() {
    Memory.ticks = _ticks
}

var _increase = function(moduleName) {
    getTicks()
    var got = _ticks[moduleName]
    if (!got) return
    var ret = got[1] + 1 >= got[0]
    _ticks[moduleName] = [got[0], (got[1] + 1) % got[0]]
    return ret
}

var tick = function() {
    var ticks = getTicks()
    for (var moduleName in ticks) {
        if (_increase(moduleName)) require(moduleName).tick()
    }
    save()
}

var register = function(moduleName, interval, force) {
    var tick = getTick(moduleName)
    if (!tick || tick[0] !== interval) {
        setTick(moduleName, interval)
    }
}

module.exports = {
    register,
    tick,
};