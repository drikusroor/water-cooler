extends Node

onready var HP = get_node("CanvasLayer/Control/HP")

func update_hp(hp, max_hp):
	HP.update_hp(hp, max_hp)
