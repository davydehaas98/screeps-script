module.exports = {
  run: function(creep) {
    // Attack Hostile Creep
    let rampart = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
      filter: r => r.structureType === STRUCTURE_RAMPART
    })
    let enemy = creep.pos.findInRange(FIND_HOSTILE_CREEPS, 1)

    if (rampart !== undefined) {
      // In rampart
      if (creep.pos.isEqualTo(rampart.pos)) {
        if (enemy !== undefined) {
          creep.attack(enemy)
        }
      } else {
        creep.moveToDraw(rampart.pos)
      }
    }
  }
}