module.exports = {
  run: function (creep) {
    // No energy
    if (creep.memory.working && creep.carry.energy === 0) {
      creep.memory.working = false
    }

    // Full capacity
    else if (!creep.memory.working & creep.carry.energy === creep.carryCapacity) {
      creep.memory.working = true
    }

    // Transfer energy
    if (creep.memory.working) {
      var structure = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
        filter: s => (
          s.structureType === STRUCTURE_SPAWN
          || s.structureType === STRUCTURE_EXTENSION
          || s.structureType === STRUCTURE_TOWER)
          && s.energy < s.energyCapacity
      })

      if (!structure) {
        structure = creep.room.storage
      }

      // Found storage
      if (structure) {
        if (creep.transfer(structure, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
          creep.moveToDraw(structure, { maxRooms: 1 })
        }
      }
    }

    // Harvest Energy
    else {
      creep.getEnergy(true, false)
    }
  }
}
