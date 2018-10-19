require('prototype.spawn')()
var roleHarvester = require('role.harvester')
var roleUpgrader = require('role.upgrader')
var roleBuilder = require('role.builder')
var roleRepairer = require('role.repairer')
var roleWallRepairer = require('role.wallRepairer')
var roleLongDistanceHarvester = require('role.longDistanceHarvester')
var roleClaimer = require('role.claimer')

var HOME = 'W3N7'

module.exports.loop = function () {
  // Run creep
  for (let name in Memory.creeps) {
    // Clear Memory
    if(!Game.creeps[name]) {
      delete Memory.creeps[name]
    } else {
      var creep = Game.creeps[name]
      switch (creep.memory.role) {
        case 'harvester':
          roleHarvester.run(creep)
          break
        case 'upgrader':
          roleUpgrader.run(creep)
          break
        case 'builder':
          roleBuilder.run(creep)
          break
        case 'repairer':
          roleRepairer.run(creep)
          break
        case 'wallRepairer':
          roleWallRepairer.run(creep)
          break
        case 'longDistanceHarvester':
          roleLongDistanceHarvester.run(creep)
          break
        case 'claimer':
          roleClaimer.run(creep)
          break
        }
    }
  }

  var towers = _.filter(Game.structures, s => s.structureType == STRUCTURE_TOWER)
  for (let tower of towers) {
    var target = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS)
    if (target != undefined) {
      tower.attack(target)
    }
  }

  var minNumberOfHarvesters = 10
  var minNumberOfUpgraders = 1
  var minNumberOfBuilders = 2
  var minNumberOfRepairers = 2
  var minNumberOfWallRepairers = 1
  var minLongDistanceHarvesters = 1
  var numberOfHarvesters = _.sum(Game.creeps, (c) => c.memory.role == 'harvester')
  var numberOfUpgraders = _.sum(Game.creeps, (c) => c.memory.role == 'upgrader')
  var numberOfBuilders = _.sum(Game.creeps, (c) => c.memory.role == 'builder')
  var numberOfRepairers = _.sum(Game.creeps, (c) => c.memory.role == 'repairer')
  var numberOfWallRepairers = _.sum(Game.creeps, (c) => c.memory.role == 'wallRepairer')
  var numberOfLongDistanceHarvesters = _.sum(Game.creeps, (c) => c.memory.role == 'longDistanceHarvester')

  var energy = Game.spawns.Spawn1.room.energyCapacityAvailable
  var name = undefined

  // Spawn creep
  if (numberOfHarvesters < minNumberOfHarvesters) {
    name = Game.spawns.Spawn1.createCustomCreep(energy, 'harvester')
    // Saveguard
    if (name == ERR_NOT_ENOUGH_ENERGY && numberOfHarvesters == 0) {
      name = Game.spawns.Spawn1.createCustomCreep(Game.spawns.Spawn1.room.energyAvailable, 'harvester')
    }
  }  else if (numberOfUpgraders < minNumberOfUpgraders) {
    name = Game.spawns.Spawn1.createCustomCreep(energy, 'upgrader')
  } else if (numberOfRepairers < minNumberOfRepairers) {
    name = Game.spawns.Spawn1.createCustomCreep(energy, 'repairer')
  } else if (numberOfBuilders < minNumberOfBuilders) {
    name = Game.spawns.Spawn1.createCustomCreep(energy, 'builder')
  } else if (numberOfWallRepairers < minNumberOfWallRepairers) {
    name = Game.spawns.Spawn1.createCustomCreep(energy, 'wallRepairer')
  } 
  // else if (numberOfLongDistanceHarvesters < minLongDistanceHarvesters) {
  //   name = Game.spawns.Spawn1.createLongDistanceHarvester(energy, 1, HOME, 'W3N7', 0)
  // } 
  else {
    name = Game.spawns.Spawn1.createCustomCreep(energy, 'builder')
  }

  if (typeof name === 'string') { 
    console.log(name + ', welcome to Creepers Rift!')
    console.log('Harvesters: ' + numberOfHarvesters)
    console.log('Upgraders: ' + numberOfUpgraders)
    console.log('Builders: ' + numberOfBuilders)
    console.log('Repairers: ' + numberOfRepairers)
    console.log('Wall Repairers: ' + numberOfWallRepairers)
    console.log('Long Distance Harvesters: ' + numberOfLongDistanceHarvesters)
  }
}
