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

      if (structure == undefined) {
        structure = creep.room.storage
      }

      // Found storage
      if (structure != undefined) {
        if(creep.transfer(structure, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
          creep.moveToDraw(structure, { maxRooms: 1 })
        }
      }
    }
    
    // Harvest Energy
    else {
      // Find closest container
      let container = creep.pos.findClosestByPath(FIND_STRUCTURES, {
        filer: s => s.structureType == STRUCTURE_CONTAINER && s.store[RESOURCE_ENERGY] > 0
      })

      if (container == undefined) {
        container = creep.room.storage
      }

      // Found container
      if (container != undefined) {
        if (creep.withdraw(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
          creep.moveToDraw(container)
        }
      }
    }
  }
}
