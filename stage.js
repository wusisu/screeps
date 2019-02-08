var constants = require('constants')

var _stage = Memory.stage
var _stageIndex = constants.STAGES.indexOf(_stage)


var shouldRun = function(stage) {
    return constants.STAGES.indexOf(stage) <= _stageIndex
}

var between = function(stageLeft, stageRight) {
    return constants.STAGES.indexOf(stageLeft) <= _stageIndex && 
    constants.STAGES.indexOf(stageRight) >= _stageIndex
}

var after = function(stage) {
    return constants.STAGES.indexOf(stage) > _stageIndex
}

module.exports = {
    shouldRun,
    between,
    after,
};