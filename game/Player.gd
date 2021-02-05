extends KinematicBody2D

export (int) var speed = 200
export (int) var max_hp = 20

onready var Game = get_node("/root/Game")
onready var HUD = get_node("/root/Game/HUD")
onready var Name = get_node("Name")

var id = null
var is_player = false
var prev_pos = null
var hp = max_hp

func configure(payload):
	id = payload.id
	is_player = payload.id == Game.connection_id
	Name.set_name(payload.name)
	HUD.update_hp(hp, max_hp)
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
	
	
