extends Node

onready var Game = get_node("/root/Game")
onready var MenuPanelNode = get_node("Panel")
onready var ChannelInput = get_node("Panel/ChannelInput")

# Called when the node enters the scene tree for the first time.
func _ready():
	pass # Replace with function body.

func _input(event):
	if Input.is_action_just_pressed("toggle_menu"):
		if Game.in_game:
			MenuPanelNode.visible = !MenuPanelNode.visible

func _on_Button_pressed():
#	ws.disconnect_from_host(1000, str(player_data["id"]))
	get_tree().quit()

func _on_JoinGame_pressed():
	var channel = ChannelInput.text
	Game._dispatch_action("JOIN_CHANNEL", channel)
