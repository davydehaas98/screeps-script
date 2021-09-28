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

    if (creep.memory.working) {
      // Upgrade Tower
      let tower = creep.pos.findClosestByRange(FIND_MY_STRUCTURES, {
        filter: t => t.structureType === STRUCTURE_TOWER && t.energy < t.energyCapacity
      })
      if (tower && creep.transfer(tower) === ERR_NOT_IN_RANGE) {
        creep.moveToDraw(tower, { maxRooms: 1 })             
      }
      // Upgrade controller
      else if (creep.upgradeController(creep.room.controller) === ERR_NOT_IN_RANGE) {
        creep.moveToDraw(creep.room.controller, { maxRooms: 1 })
      }
    }

    // Harvest Energy
    else {
      creep.getEnergy(true, true)
    }
  }
}
