var roleBuilder = require('role.builder')

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

    // Find repairable structure
    if (creep.memory.working == true) {
      var structure = creep.pos.findClosestByPath(FIND_STRUCTURES, {
        filter: s => s.hits < s.hitsMax && s.structureType != STRUCTURE_WALL
      })
      if (structure != undefined) {
        if (creep.repair(structure) == ERR_NOT_IN_RANGE) {
          creep.moveToDraw(structure, { maxRooms: 1 })
        }
      } 
      // Look for construction site
      else {
        roleBuilder.run(creep)
      }
    }

    // Harvest energy from source
    else {
      creep.getEnergy(true, true)
    }
  }
}