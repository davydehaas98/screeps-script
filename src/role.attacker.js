module.exports = {
  run: function (creep) {
    // Attack Hostile Creep
    let enemy = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS)
    if (enemy) {
      if (creep.rangedAttack(enemy) === ERR_NOT_IN_RANGE) {
        creep.moveToDraw(enemy)
      }
    } else {
      creep.moveToDraw(Game.flags.Flag1)
    }
  }
}
