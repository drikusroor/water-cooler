extends KinematicBody2D

export (int) var speed = 200
export (int) var id = 0

var connection_id = null
var is_player = false
var prev_pos = null

func configure(connection_id, is_player):
	id = connection_id
	is_player = true

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
	get_input()
	velocity = move_and_slide(velocity)
	
	var curr_pos = global_position
	if curr_pos != prev_pos:
		Game.ActionUpdatePlayer({ "position": curr_pos })
		prev_pos = curr_pos
	
	
