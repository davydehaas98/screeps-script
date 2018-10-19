module.exports = function() {
  StructureSpawn.prototype.createCustomCreep = 
  function(energy, roleName) {
    var numberOfParts = Math.floor(energy / 200)
    var body = []
    for (let i = 0; i< numberOfParts; i++) {
      body.push(WORK)
    }
    for (let i = 0; i< numberOfParts; i++) {
      body.push(CARRY)
    }
    for (let i = 0; i< numberOfParts; i++) {
      body.push(MOVE)
    }

    return this.createCreep(body, undefined, {
      role: roleName, 
      working: false
    })
  }
  
  StructureSpawn.prototype.createLongDistanceHarvester =
  function (energy, numberOfWorkParts, home, target, sourceIndex) {
    var body = []
    for (let i = 0; i < numberOfWorkParts; i++) {
      body.push(WORK)
    }

    energy -= 150 * numberOfWorkParts

    var numberOfParts = Math.floor(energy / 100)
    for (let i = 0; i < numberOfParts; i++) {
      body.push(CARRY)
    }
    for (let i = 0; i < numberOfParts + numberOfWorkParts; i++) {
      body.push(MOVE)
    }

    return this.createCreep(body, undefined, {
      role: 'longDistanceHarvester',
      working: false,
      home: home,
      target: target,
      sourceIndex: sourceIndex
    })
  }
}