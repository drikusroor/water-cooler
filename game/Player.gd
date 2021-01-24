extends KinematicBody2D

export (int) var speed = 200

onready var Game = get_node("/root/Game")

var id = null
var is_player = false
var prev_pos = null

func configure(payload):
	id = payload.id
	is_player = payload.id == Game.connection_id
	if is_player:
		Game._dispatch_action("PLAYER_UPDATE", { "id": id, "pos": [position[0], position[1]] })

var velocity = Vector2()

func get_input():
	velocity = Vector2()
	if Input.is_action_pressed("ui_right"):
		velocity.x += 1
	if Input.is_action_pressed('ui_left'):
		velocity.x -= 1
	if Input.is_action_pressed('ui_down'):
		velocity.y += 1
	if Input.is_action_pressed('ui_up'):
		velocity.y -= 1
	velocity = velocity.normalized() * speed

func _physics_process(delta):
	if is_player:
		get_input()
		velocity = move_and_slide(velocity)
		var curr_pos = position
		if curr_pos != prev_pos:
			Game._dispatch_action("PLAYER_UPDATE", { "id": id, "pos": [curr_pos[0], curr_pos[1]] })
			prev_pos = curr_pos
	
	
