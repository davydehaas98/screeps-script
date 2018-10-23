StructureTower.prototype.defend = function() {
  // Attack mode
  var enemy = this.pos.findClosestByRange(FIND_HOSTILE_CREEPS)
  if (enemy) {
    this.attack(enemy)
  }
  
  // Repair mode
  else {
    let walls = this.room.find(FIND_STRUCTURES, {
      filter: s => s.structureType === STRUCTURE_WALL || s.structureType === STRUCTURE_RAMPART
    })

    let target

    for (let percentage = 0.0001; percentage <= 1; percentage += 0.0001) {
      for (let wall of walls) {
        if (wall.hits / wall.hitsMax < percentage) {
          target = wall
          break
        }
      }
      if (target) {
        break
      }
    }
    this.repair(target)
  }
}