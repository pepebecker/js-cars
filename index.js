const pixi = require('pixi.js')

const screen_width = 640
const screen_height = 480

const stage = new pixi.Container()
const renderer = pixi.autoDetectRenderer(screen_width, screen_height)

const timeScale = 1

var player = undefined
var roadOffset = -64
var enemies = []

var lastTime = 0
var spawnFactor = 600

document.body.appendChild(renderer.view)

pixi.loader.add([
	'resources/road.png',
	'resources/car-black.png',
	'resources/car-blue.png',
	'resources/car-brown.png',
	'resources/car-green.png',
	'resources/car-red.png',
	'resources/explosion.png'
]).load(setup)

function radian (x) {
	return x / 180 * Math.PI
}

function Car (color, position, rotation) {
	var car = new PIXI.Sprite(pixi.loader.resources['resources/car-' + color + '.png'].texture)
	stage.addChild(car)
	car.pivot.x = car.width / 2
	car.pivot.y = car.height / 2
	car.x = position.x
	car.y = position.y
	car.rotation = radian(rotation)
	car.lane = 1
	car.turnDir = 0
	car.turnFactor = 25
	car.switchSpeed = 2
	car.switchingLane = false
	car.betweenLanesX = screen_width / 2
	car.leftLaneX = car.betweenLanesX - car.width / 2
	car.rightLaneX = car.betweenLanesX + car.width / 2
	car.switchLane = function () {
		car.lane = +!car.lane
		car.turnDir = (car.lane === 1 ? 1 : -1)
		car.switchingLane = true
	}
	car.update = function () {
		if (car.switchingLane) {
			if (car.lane === 1) {
				if (car.position.x < car.rightLaneX) {
					car.position.x += car.switchSpeed * timeScale
					car.rotation = radian(car.turnFactor)
				} else {
					car.rotation = 0
					car.switchingLane = false
				}
			} else {
				if (car.position.x > car.leftLaneX) {
					car.position.x -= car.switchSpeed * timeScale
					car.rotation = radian(-car.turnFactor)
				} else {
					car.rotation = 0
					car.switchingLane = false
				}
			}
		}
		// car.rotation = Math.max(0, Math.PI * 0.3 - Math.abs(car.betweenLanesX - car.position.x) * 0.03) * car.turnDir
	}
	return car
}

function setup() {
	road = new PIXI.Sprite(pixi.loader.resources['resources/road.png'].texture)
	stage.addChild(road)
	road.x = screen_width / 2 - road.width / 2

	player = Car('red', { x: screen_width / 2 + 32, y: screen_height / 2 * 1.5 }, 0)

	animate()
}

function animate(time) {
    requestAnimationFrame(animate)

		road.y = (road.y >= 0 ? roadOffset : road.y + 2 * timeScale)

		player.update()

		if (time - lastTime >= spawnFactor) {
			var xPos = Math.round(Math.random()) * 64
			var color = 'green'

			switch (Math.round(Math.random() * 3)) {
				case 0:
					color = 'green'
					break
				case 1:
					color = 'blue'
					break
				case 2:
					color = 'brown'
					break
				case 3:
					color = 'black'
					break
			}

			enemies.push(Car(color, { x: screen_width / 2 - 32 + xPos, y: -500 }, 180))
			lastTime = time
		}

		enemies.forEach(function (enemy, i) {
			enemy.position.y += 4 * timeScale

			var distanceX = Math.abs(enemy.position.x - player.position.x)
			var distanceY = Math.abs(enemy.position.y - player.position.y)

			if (distanceX < 32 && distanceY < 32) {
				alert('Game Over')
				enemies.forEach(function (enemy, i) {
					stage.removeChild(enemy)
				})
				enemies = []
				lastTime = time
			}

			if (enemy.position.y > screen_height + enemy.height) {
				enemies.splice(i, 1)
			}
		})

    renderer.render(stage)
}

document.onkeydown = function(e) {
	if (e.code === 'Space') {
		player.switchLane()
	}
}
