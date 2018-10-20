module.exports = {
  run: function(creep) {
    if (creep.room.name !== creep.memory.target) {
      var exit = creep.room.findExitTo(creep.memory.target)
      creep.moveToDraw(creep.pos.findClosestByRange(exit))
    }

    // Claim controller
    else {
        if (creep.claimController(creep.room.controller) === ERR_NOT_IN_RANGE) {
          creep.moveToDraw(creep.room.controller)
        }
    }
  }
}
