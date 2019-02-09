var energyRate = function(obj) {
    return obj.energy * 1.0 / obj.energyCapacity
}

var energyFull = function(obj, diff) {
    diff = diff || 0
    return obj.energy + diff >= obj.energyCapacity
}

var energyEmpty = function(obj, diff) {
    diff = diff || 0
    return obj.energy <= diff
}

module.exports = {
    energyRate,
    energyFull,
    energyEmpty,
}