var roles = {
  harvester: require('role.harvester'),
  upgrader: require('role.upgrader'),
  builder: require('role.builder'),
  repairer: require('role.repairer'),
  wallRepairer: require('role.wallRepairer'),
  longDistanceHarvester: require('role.longDistanceHarvester'),
  claimer: require('role.claimer'),
  miner: require('role.miner'),
  lorry: require('role.lorry'),
  attacker: require('role.attacker'),
  defender: require('role.defender')
}

Creep.prototype.moveToDraw = function (target) {
  return this.moveTo(target, {
    maxRooms: 1,
    visualizePathStyle: { stroke: 'ffaa00' }
  })
}

Creep.prototype.runRole = function () {
  roles[this.memory.role].run(this)
}

Creep.prototype.getEnergy = function (useContainer, useSource) {
  let container

  if (useContainer) {
    // Find closest container
    container = this.pos.findClosestByPath(FIND_STRUCTURES, {
      filter: s => (
        s.structureType === STRUCTURE_CONTAINER
        || s.structureType === STRUCTURE_STORAGE
      )
        && s.store[RESOURCE_ENERGY] > 0
    })

    if (container) {
      if (this.withdraw(container, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
        this.moveToDraw(container)
      }
    }
  }

  if (!container && useSource) {
    // Find closest source
    var source = this.pos.findClosestByPath(FIND_SOURCES)

    // Harvest energy
    if (this.harvest(source) === ERR_NOT_IN_RANGE) {
      this.moveToDraw(source)
    }
  }
}
