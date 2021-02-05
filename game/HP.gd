extends RichTextLabel

func update_hp(hp, max_hp):
	if not visible:
		visible = true
	text = "HP: %s/%s" % [hp, max_hp]
