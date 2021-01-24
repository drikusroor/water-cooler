extends Node

onready var Game = get_node("/root/Game")
var PlayerResource = load("res://Player.tscn")

func _ready():
	pass # Replace with function body.

func add_player(payload):
	var new_player = PlayerResource.instance()
	add_child(new_player)
	new_player.configure(payload)

func player_update(payload):
	for player in get_children():
		if player.id == payload.id:
			if payload.has('pos'):
				var pos = payload.pos
				player.position = Vector2(pos[0], pos[1])
				
				if payload.has('name'):
					player.Name.set_name(payload.name)
				

func player_remove(id):
	for player in get_children():
		if player.id == id:
			player.queue_free()

func sync_players(s_players):
	print(s_players)
	for s_player in s_players:
		var found_player = false
		for player in get_children():
			if player.id == s_player.id:
				found_player = true
				print(s_player)
				player_update(s_player)
		if !found_player:
			add_player(s_player)
			
	for player in get_children():
		var found_player = false
		for s_player in s_players:
			if player.id == s_player.id:
				found_player = true
		if !found_player:
			player.queue_free()
