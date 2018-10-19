require('prototype.creep')()

module.exports = {
  run: function(creep) {
    // No energy
    if (creep.memory.working == true && creep.carry.energy == 0) {
      creep.memory.working = false
    }

    // Full capacity
    else if (creep.memory.working == false & creep.carry.energy == creep.carryCapacity) {
      creep.memory.working = true
    }
  
    // Transfer energy
    if(creep.memory.working == true) {
      var structure = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
        filter: s => (s.structureType == STRUCTURE_SPAWN
        || s.structureType == STRUCTURE_EXTENSION
        || s.structureType == STRUCTURE_TOWER)
        && s.energy < s.energyCapacity
      })
      if (structure != undefined) {
        if(creep.transfer(structure, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
          creep.moveToDraw(structure, { maxRooms: 1 })
        }
      }
    } 
    
    // Harvest Energy
    else {
      // var source = creep.pos.findClosestByPath(FIND_DROPPED_RESOURCES)
      // if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
      //   creep.moveTo(source, { maxRooms: 1 })
      // }
      source = creep.pos.findClosestByPath(FIND_SOURCES)
      if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
        creep.moveToDraw(source, { maxRooms: 1 })
      }
    }
  }
}
