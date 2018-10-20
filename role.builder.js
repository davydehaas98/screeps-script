var roleUpgrader = require('role.upgrader')

module.exports = {
  run: function(creep) {
    if (creep.memory.target !== undefined && creep.room.name !== creep.memory.target) {
      var exit = creep.room.findExitTo(creep.memory.target)
      creep.moveToDraw(creep.pos.findClosestByRange(exit))
      return
    }

    // No energy
    if (creep.memory.working && creep.carry.energy === 0) {
      creep.memory.working = false
    }

    // Full capacity
    else if (!creep.memory.working & creep.carry.energy === creep.carryCapacity) {
      creep.memory.working = true
    }

    // Find construction site
    if (creep.memory.working) {
      var constructionSite = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES)
      if (constructionSite !== undefined) {
        if (creep.build(constructionSite) === ERR_NOT_IN_RANGE) {
          creep.moveToDraw(constructionSite)
        }
      } else {
        roleUpgrader.run(creep)
      }
    }

    // Harvest energy from source
    else {
      creep.getEnergy(true, true)
    }
  }
}
