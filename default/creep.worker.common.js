exports.getResource = function(creep) {
    var sources = creep.room.find(FIND_SOURCES);
    if (sources.length) {
        var id = creep.id
        if (!id) return;
        var hash = parseInt(id.substring(20,24), 16)
        var index = hash % sources.length
        var source = sources[index]
        if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
            creep.moveTo(source);
        }
    }

}
