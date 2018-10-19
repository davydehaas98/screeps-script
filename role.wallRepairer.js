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

    // Find repairable wall
    if (creep.memory.working == true) {
      var walls = creep.room.find(FIND_STRUCTURES, {
        filter: s => s.structureType == STRUCTURE_WALL
      })

      var target = undefined

      for (let percentage = 0.0001; percentage <= 1; percentage += 0.0001) {
        for (let wall of walls) {
          if (wall.hits / wall.hitsMax < percentage) {
            target = wall
            break
          }
        }
        if (target != undefined) {
          break
        }
      }

      if (target != undefined) {
        if (creep.repair(target) == ERR_NOT_IN_RANGE) {
          creep.moveTo(target, {maxRooms: 1})
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