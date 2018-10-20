var roles = [
  'harvester',
  'lorry',
  'claimer',
  'upgrader',
  'repairer',
  'builder',
  'wallRepairer'
]

StructureSpawn.prototype.spawnCreepsIfNecessary = function () {
  let room = this.room
  let creepsInRoom = room.find(FIND_MY_CREEPS)

  // Number of creeps assigned to a specific role
  let numberOfCreeps = {}
  for(let role of roles) {
    numberOfCreeps[role] = _.sum(creepsInRoom, c => c.memory.role == role)
  }

  let maxEnergy = room.energyCapacityAvailable
  let name = undefined

  // Create backup creep if nessecary
  if(numberOfCreeps['harvester'] == 0 && numberOfCreeps['lorry'] == 0) {
    if (numberOfCreeps['miner'] > 0 || 
    (room.storage != undefined && room.storage.store[RESOURCE_ENERGY] >= 150 + 550)) {
      // Create lorry
      name = this.createLorry(150)
    }
    else {
      // Create harvester
      name = this.createCustomCreep(room.energyAvailable, 'harvester')
    }
  }

  // No backup needed
  else {
    // Check if all sources have miners
    let sources = room.find(FIND_SOURCES)
    for (let source of sources) {
      if (!_.some(creepsInRoom, c => c.memory.role == 'miner' && c.memory.sourceIndex == source.id)) {
        // Has the source a container
        let containers = source.pos.findInRange(FIND_STRUCTURES, 1, {
          filter: s => s.structureType == STRUCTURE_CONTAINER
        })
        // The source has a container
        if (containers.length > 0) {
          // Create a miner
          name = this.createMiner(source.id)
          break
        }
      }
    }
  }

  if (name == undefined) {
    for (let role of roles) {
      // Check for claim order
      if (role == 'claimer' && this.memory.claimRoom != undefined) {
        // Create a claimer
        name = this.createClaimer(this.memory.claimRoom)

        if (_.isString(name)) {
          // Delete claim order
          delete this.memory.claimRoom
        }
      }

      // Check other roles
      else if (numberOfCreeps[role] < this.memory.minCreeps[role]) {
        if (role == 'lorry') {
          name = this.createLorry(150)
        }
        else {
          name = this.createCustomCreep(maxEnergy, role)
        }
        break
      }
    }
  }

  // No spawn occurred, check for LongDistanceHarvesters
  let numberOfLongDistanceHarvesters = {}
  if (name == undefined) {
    for (let roomName in this.memory.minLongDistanceHarvesters) {
      numberOfLongDistanceHarvesters[roomName] = _.sum(Game.creeps, c => c.memory.role == 'longDistanceHarvester' && c.memory.target == roomName)

      if (numberOfLongDistanceHarvesters[roomName] < this.memory.minLongDistanceHarvesters[roomName]) {
        name = this.createLongDistanceHarvester(maxEnergy, 2, room.name, roomName, 0)
      }
    }
  }

  // Print name to console
  if (name != undefined && _.isString(name)) {
    console.log(this.name + " spawned new creep: " + name + " (" + Game.creeps[name].memory.role + ")")
    for (let role of roles) {
        console.log(role + ": " + numberOfCreeps[role])
    }
    for (let roomName in numberOfLongDistanceHarvesters) {
        console.log("LongDistanceHarvester" + roomName + ": " + numberOfLongDistanceHarvesters[roomName])
    }
  }
}

// Create custom creep function
StructureSpawn.prototype.createCustomCreep = function(energy, roleName) {
  var numberOfParts = Math.floor(energy / 200)
  var body = []
  for (let i = 0; i < numberOfParts; i++) {
    body.push(WORK)
  }
  for (let i = 0; i < numberOfParts; i++) {
    body.push(CARRY)
  }
  for (let i = 0; i < numberOfParts; i++) {
    body.push(MOVE)
  }

  return this.createCreep(body, undefined, {
    role: roleName, 
    working: false
  })
}

// Create long distance harvester function
StructureSpawn.prototype.createLongDistanceHarvester = function(energy, numberOfWorkParts, home, target, sourceIndex) {
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

// Create claimer function
StructureSpawn.prototype.createClaimer = function(target) {
  return this.createCreep([CLAIM,MOVE], undefined, {
    role: 'claimer',
    target: target
  })
}

// Create miner function
StructureSpawn.prototype.createMiner = function(sourceId) {
    return this.createCreep([WORK, WORK, WORK, WORK, WORK, MOVE], undefined, {
      role: 'miner',
      sourceId: sourceId 
    })
}

// Create lorry function
StructureSpawn.prototype.createLorry = function(energy) {
  var numberOfParts = Math.floor(energy / 150)
  var body = []
  for (let i = 0; i < numberOfParts * 2; i++) {
    body.push(CARRY)
  }
  for (let i = 0; i < numberOfParts; i++) {
    body.push(MOVE)
  }

  return this.createCreep(body, undefined, {
    role: 'lorry', 
    working: false
  })
}
