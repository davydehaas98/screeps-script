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
    if (creep.memory.working == true) {
      if (creep.room.name == creep.memory.home) {
        var structure = creep.pos.findClosestByRange(FIND_MY_STRUCTURES, {
          filter: s => (s.structureType == STRUCTURE_SPAWN
          || s.structureType == STRUCTURE_EXTENSION 
          || s.structureType == STRUCTURE_TOWER)
          && s.energy < s.energyCapacity
        })
        if (structure != undefined) {
          if (creep.transfer(structure, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            creep.moveToDraw(structure)
          }
        }
      } else {
        var exit = creep.room.findExitTo(creep.memory.home)
        creep.moveToDraw(creep.pos.findClosestByRange(exit))
      }
    } 
    
    // Harvest Energy
    else {
      if (creep.room.name == creep.memory.target) {
        var source = creep.room.find(FIND_SOURCES)[creep.memory.sourceIndex]
        if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
          creep.moveToDraw(source)
        }
      } else {
        var exit = creep.room.findExitTo(creep.memory.target)
        creep.moveToDraw(creep.pos.findClosestByRange(exit))
      }
    }
  }
}