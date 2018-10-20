module.exports = {
  run: function(creep) {
    // No energy
    if (creep.memory.working && creep.carry.energy === 0) {
      creep.memory.working = false
    }

    // Full capacity
    else if (!creep.memory.working & creep.carry.energy === creep.carryCapacity) {
      creep.memory.working = true
    }

    // Upgrade controller
    if (creep.memory.working) {
      if (creep.upgradeController(creep.room.controller) === ERR_NOT_IN_RANGE) {
        creep.moveToDraw(creep.room.controller, { maxRooms: 1 })
      }
    }

    // Harvest Energy
    else {
      creep.getEnergy(true, true)
    }
  }
}
