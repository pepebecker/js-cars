const pixi = require('pixi.js')

const screen_width = 640
const screen_height = 480

const stage = new pixi.Container()
const renderer = pixi.autoDetectRenderer(screen_width, screen_height)

let lane = 0
let player
let roadY

document.body.appendChild(renderer.view)

pixi.loader.add([
	'resources/Road.png',
	'resources/Car-Black.png',
	'resources/Car-Blue.png',
	'resources/Car-Brown.png',
	'resources/Car-Green.png',
	'resources/Car-Red.png'
]).load(setup)

function setup() {
	road = new PIXI.Sprite(pixi.loader.resources['resources/Road.png'].texture)
	stage.addChild(road)

	road.x = screen_width / 2 - road.width / 2
	roadY = 0

	player = new PIXI.Sprite(pixi.loader.resources['resources/Car-Red.png'].texture)
	stage.addChild(player)

	player.x = screen_width / 2
	player.y = screen_height / 2

	animate()
}

function animate() {
    requestAnimationFrame(animate)

    roadY += 3;
    roadY %= 64
    road.y = roadY -64

    player.x = screen_width / 2 - player.width + player.width * lane

    renderer.render(stage)
}

document.onkeydown = function(e) {
	if (e.code === 'Space') {
		lane = +!lane
	}
}