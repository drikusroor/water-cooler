extends Node2D

var ws = WebSocketClient.new()
var URL = "ws://127.0.0.1:9001"
#var URL = "ws://water-cooler-game.herokuapp.com/"

onready var Players = get_node("Players")
onready var Menu = get_node("Menu")

var connection_id = null
var in_game = false
var current_channel = null

var messageTypes = {
	'REQUEST_ID': "REQUEST_ID",
	'ASSIGN_ID': "ASSIGN_ID",
	'GAME_STATE': "GAME_STATE",
	'PLAYER_STATE': "PLAYER_STATE"
}

func _ready():
	ws.connect('connection_closed', self, '_closed')
	ws.connect('connection_error', self, '_closed')
	ws.connect('connection_established', self, '_connected')
	ws.connect('data_received', self, '_on_data')
	
	var err = ws.connect_to_url(URL)
	if err != OK:
		print('connection refused')
	else:
		ws.poll()
		
func _closed():
	print("connection closed")
	
func _connected(info):
	print("Connected! Info: %s" % info)
	print("connected to host")
	
func _on_data():
	var data = JSON.parse(ws.get_peer(1).get_packet().get_string_from_utf8()).result
	var payload = data.payload
	var type = data.type
	var is_player = false
	var player_id = null
	
	if data.has("isPlayer"):
		is_player = data["isPlayer"]
		
	if type == "MESSAGE":
		print(payload)
	elif type == "RETURN_FETCH_STATE":
		Players.sync_players(payload)
	elif type == "RETURN_CHANNEL_JOIN":
		if is_player:
			connection_id = payload.id
			_dispatch_action("FETCH_STATE", data.channelName)
			Menu._toggle()
			in_game = true
		Players.add_player(payload)
	elif type == "RETURN_PLAYER_UPDATE":
		Players.player_update(payload)
	elif type == "RETURN_PLAYER_DISCONNECT":
		Players.player_remove(payload)
	else:
		print("%s type not recognized" % data.type)
		
func _dispatch_action(type, payload):
	var action = { 'type': type, 'payload': payload }
	ws.get_peer(1).put_packet(JSON.print(action).to_utf8())

func _process(delta):
	ws.poll()
