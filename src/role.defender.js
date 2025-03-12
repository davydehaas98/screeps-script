module.exports = {
  run: function (creep) {
    // Attack Hostile Creep
    let rampart = Game.getObjectById(creep.memory.rampartId)
    if (rampart) {
      if (creep.pos.isEqualTo(rampart.pos)) {
        let enemy = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS, 1)
        if (enemy) {
          creep.attack(enemy)
        }
      } else {
        creep.moveToDraw(rampart.pos)
      }
    }
  }
}
