extends Node2D

var ws = WebSocketClient.new()
#var URL = "ws://127.0.0.1:9001/"
var URL = "ws://water-cooler-game.herokuapp.com/"
var enemy = preload("res://Enemy.tscn")

var messageTypes = {
	'REQUEST_ID': "REQUEST_ID",
	'ASSIGN_ID': "ASSIGN_ID",
	'GAME_STATE': "GAME_STATE",
	'PLAYER_STATE': "PLAYER_STATE"
}

var player_data = {
	"x": 0,
	"y": 0,
	"id": 0
}

var enemies = []

func _ready():
	ws.connect('connection_closed', self, '_closed')
	ws.connect('connection_error', self, '_closed')
	ws.connect('connection_established', self, '_connected')
	ws.connect('data_received', self, '_on_data')
	
	var err = ws.connect_to_url(URL)
	if err != OK:
		print('connection refused')

func _closed():
	print("connection closed")
	
func _connected():
	print("connected to host")
	
func _on_data():
	var data = JSON.parse(ws.get_peer(1).get_packet().get_string_from_utf8()).result
	
	if (player_data["id"] < 1 and data.type == messageTypes.ASSIGN_ID):
		print("Assigned ID is ", data.payload)
		player_data["id"] = data.payload
	elif (data.type == messageTypes.GAME_STATE):
		for enemy in enemies:
			enemy.queue_free()
		enemies = []
		for player in data.payload:
			if player.id != player_data["id"]:
				var e = enemy.instance()
				e.position = Vector2(player["x"], player["y"])
				enemies.append(e)
				add_child(e)

func _process(delta):
	if player_data["id"] < 1:
		var action = { 'type': messageTypes.REQUEST_ID }
		ws.get_peer(1).put_packet(JSON.print(action).to_utf8())
		ws.poll()
	
	if player_data["id"] > 0:
		player_data["x"] = $Player.position.x
		player_data["y"] = $Player.position.y
		var action = { 'type': messageTypes.PLAYER_STATE, 'payload': player_data }
		ws.get_peer(1).put_packet(JSON.print(action).to_utf8())
		ws.poll()

func _on_Button_pressed():
	ws.disconnect_from_host(1000, str(player_data["id"]))
	get_tree().quit()
