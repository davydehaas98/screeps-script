module.exports = function () {
  Creep.prototype.moveToDraw = function (target) {
    return this.moveTo(target, {
      maxRooms: 1,
      visualizePathStyle: { stroke: 'ffaa00'}
    })
  }
}