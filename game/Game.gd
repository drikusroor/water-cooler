extends Node2D

var ws = WebSocketClient.new()
var URL = "ws://127.0.0.1:9001"
#var URL = "ws://water-cooler-game.herokuapp.com/"

var in_game = false

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
	
func _connected():
	print("connected to host")
	
func _on_data():
	var data = JSON.parse(ws.get_peer(1).get_packet().get_string_from_utf8()).result
	
	if data.type == "message":
		print(data.payload)
	else:
		print("%s type not recognized" % data.type)
		print(data.forMe)
		
func _dispatch_action(type, payload):
	var action = { 'type': type, 'payload': payload }
	ws.get_peer(1).put_packet(JSON.print(action).to_utf8())

func _process(delta):
	ws.poll()
