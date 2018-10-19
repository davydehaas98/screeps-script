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
          creep.moveTo(structure, { maxRooms: 1 })
        }
      } else {
        roleBuilder.run(creep)
      }
    }

    // Harvest energy from source
    else {
      var source = creep.pos.findClosestByPath(FIND_SOURCES)
      if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
        creep.moveTo(source, { maxRooms: 1 })
      }
    }
  }
}