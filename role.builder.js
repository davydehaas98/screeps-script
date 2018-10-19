var roleUpgrader = require('role.upgrader')

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

    // Find construction site
    if (creep.memory.working == true) {
      var constructionSite = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES)
      if (constructionSite != undefined) {
        if (creep.build(constructionSite) == ERR_NOT_IN_RANGE) {
          moveTo(constructionSite)
        }
      } else {
        roleUpgrader.run(creep)
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
