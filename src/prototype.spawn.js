const { Roles } = require("./roles")

var roles = [
  'harvester',
  'lorry',
  'claimer',
  'upgrader',
  'repairer',
  'builder',
  'wallRepairer',
  'miner',
  'attacker',
  'defender'
]

StructureSpawn.prototype.spawnCreepsIfNecessary = function () {
  let room = this.room
  let creepsInRoom = room.find(FIND_MY_CREEPS)

  // Number of creeps assigned to a specific role
  let numberOfCreeps = {}
  for (const role of Roles) {
    numberOfCreeps[role] = _.sum(creepsInRoom, c => c.memory.role === role)
  }

  let maxEnergy = room.energyCapacityAvailable
  let name

  // Create backup creep
  if (
    numberOfCreeps[Roles.HARVESTER] === 0
    && numberOfCreeps[Roles.LORRY] === 0
  ) {
    if (numberOfCreeps[Roles.MINER] > 0 ||
      (room.storage && room.storage.store[RESOURCE_ENERGY] >= 150 + 550)) {
      // Create lorry
      name = this.createLorry(150)
    }
    else {
      // Create harvester
      name = this.createCustomCreep(room.energyAvailable, Roles.HARVESTER)
    }
  }

  // No backup needed
  else {
    // Check if all sources have miners
    let sources = room.find(FIND_SOURCES)
    let miners = room.find(FIND_MY_CREEPS, { filter: c => c.memory.role === Roles.MINER })

    for (let source of sources) {
      // Miner does not already exist for this source
      if (!_.some(miners, m => m.memory.sourceId === source.id)) {
        // Has the source a container
        let containers = source.pos.findInRange(FIND_STRUCTURES, 1, {
          filter: s => s.structureType === STRUCTURE_CONTAINER && s.store[RESOURCE_ENERGY] < s.storeCapacity
        })

        // Number of total miners in the room
        let numberOfMiners = room.find(FIND_MY_CREEPS, {
          filter: c => c.memory.role === Roles.MINER
        }).length
        // The source has a container and no miner
        if (containers.length > 0 && numberOfMiners < sources.length) {
          // Create a miner
          name = this.createMiner(source.id)
          break
        }
      }
    }
  }

  if (!name) {
    for (const role of roles) {
      // Check for claim order
      if (role === Roles.CLAIMER && this.memory.claimRoom) {
        // Create a claimer
        name = this.createClaimer(this.memory.claimRoom)

        if (_.isString(name)) {
          // Delete claim order
          delete this.memory.claimRoom
        }
      }

      // Check other roles
      else if (numberOfCreeps[role] < this.memory.minCreeps[role]) {
        if (role === Roles.LORRY) {
          name = this.createLorry(150)
        }
        else if (role === Roles.DEFENDER) {
          let ramparts = room.find(FIND_MY_STRUCTURES, {
            filter: s => s.structureType === STRUCTURE_RAMPART
          })
          for (let rampart of ramparts) {
            // Defender does not already exist for this source
            if (!_.some(creepsInRoom[role], d => d.memory.rampartId === rampart.id)) {

              // Number of total defenders in the room
              let numberOfDefenders = room.find(FIND_MY_CREEPS, {
                filter: c => c.memory.role === Roles.Defender
              }).length
              // The rampant has no defender
              if (numberOfDefenders < ramparts.length) {
                // Create a Defender
                name = this.createDefender(maxEnergy, rampart.id)
                break
              }
            }
            if (name) {
              break
            }
          }
        }
        else if (role === Roles.ATTACKER) {
          name = this.createAttacker(maxEnergy)
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
  if (!name) {
    for (let roomName in this.memory.minLongDistanceHarvesters) {
      numberOfLongDistanceHarvesters[roomName] = _.sum(Game.creeps, c => 
        c.memory.role === 'longDistanceHarvester' && c.memory.target === roomName)

      if (numberOfLongDistanceHarvesters[roomName] < this.memory.minLongDistanceHarvesters[roomName]) {
        name = this.createLongDistanceHarvester(maxEnergy, 2, room.name, roomName, 0)
      }
    }
  }

  // Print name to console
  if (name && _.isString(name)) {
    console.log(this.name + " spawned a new creep called " + name + "! (" + Game.creeps[name].memory.role + ")")
    
    for (let role of roles) {
      console.log(role + ": " + numberOfCreeps[role])
    }
    for (let roomName in numberOfLongDistanceHarvesters) {
      console.log("LongDistanceHarvester" + roomName + ": " + numberOfLongDistanceHarvesters[roomName])
    }
  }
}

// Create custom creep function
StructureSpawn.prototype.createCustomCreep = function (energy, roleName) {
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

  return this.spawnCreep(body, undefined, {
    role: roleName,
    working: false
  })
}

// Create long distance harvester function
StructureSpawn.prototype.createLongDistanceHarvester = function (energy, numberOfWorkParts, home, target, sourceIndex) {
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
    role: Roles.LONG_DISTANCE_HARVESTER,
    working: false,
    home: home,
    target: target,
    sourceIndex: sourceIndex
  })
}

// Create claimer function
StructureSpawn.prototype.createClaimer = function (target) {
  return this.createCreep([CLAIM, MOVE], undefined, {
    role: Roles.CLAIMER,
    target: target
  })
}

// Create miner function
StructureSpawn.prototype.createMiner = function (sourceId) {
  return this.createCreep([WORK, WORK, WORK, WORK, WORK, MOVE], undefined, {
    role: Roles.MINER,
    sourceId: sourceId
  })
}

// Create lorry function
StructureSpawn.prototype.createLorry = function (energy) {
  let numberOfParts = Math.floor(energy / 150)
  let body = []

  for (let i = 0; i < numberOfParts * 2; i++) {
    body.push(CARRY)
  }
  for (let i = 0; i < numberOfParts; i++) {
    body.push(MOVE)
  }

  return this.createCreep(body, undefined, {
    role: Roles.LORRY,
    working: false
  })
}

StructureSpawn.prototype.createAttacker = function (energy) {
  let numberOfParts = Math.floor(energy / 200)
  let body = []

  for (let i = 0; i < numberOfParts; i++) {
    body.push(MOVE)
  }
  for (let i = 0; i < numberOfParts; i++) {
    body.push(RANGED_ATTACK)
  }

  return this.createCreep(body, undefined, {
    role: Roles.ATTACKER
  })
}

StructureSpawn.prototype.createDefender = function (energy, rampartId) {
  let numberOfParts = Math.floor(energy / 300)
  let body = []

  for (let i = 0; i < numberOfParts / 2; i++) {
    body.push(MOVE)
  }
  for (let i = 0; i < numberOfParts; i++) {
    body.push(ATTACK)
  }
  for (let i = 0; i < numberOfParts * 2; i++) {
    body.push(TOUGH)
  }

  return this.createCreep(body, undefined, {
    role: Roles.DEFENDER,
    rampartId: rampartId
  })
}
