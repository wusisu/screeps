
//删除所有路
Game.spawns['Spawn1'].room.find(FIND_CONSTRUCTION_SITES).filter(i=>i.structureType=='road').forEach(i=>i.remove())
