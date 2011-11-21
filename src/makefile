SOURCE_FILES =\
	header.js \
	prelude.js \
	limited.js \
	enum.js \
	enumlinear.js \
	enumcycle.js \
	enumstate.js \
	id3.js \
	music.js \
	local.js \
	schemeconfig.js \
	ui.js \
	key.js \
	command.js \
	keyconfig.js \
	player.js \
	footer.js

DATE=$(shell git log -1 --pretty=format:%ad)
SED_DATE = sed "s/@DATE/${DATE}/"

VERSION = $(shell cat version.txt)
SED_VER = sed "s/@VERSION/${VERSION}/"

main.js : ${SOURCE_FILES}
	@cat $< | ${SED_DATE} | ${SED_VER} > $@
	@cp $@ ../js/

manifest.json : manifest_base.json version.txt
	@cat manifest_base.json | ${SED_VER} > $@
	@cp $@ ../

all:
	make main.js
	make manifest.json

