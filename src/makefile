SOURCE_FILES =\
	_header.js \
	prelude.js \
	limited.js \
	enum.js \
	enumlinear.js \
	enumcycle.js \
	enumdinamic.js \
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
	_footer.js

DATE=$(shell TZ=GMT date '+%Y\/%m\/%d %T (GMT)')
SED_DATE = sed "s/@DATE/${DATE}/"

VERSION = $(shell cat version.txt)
SED_VER = sed "s/@VERSION/${VERSION}/"

CHANGELOG = $(shell cat changelog.txt | sed 's/^/<br \/>/' | sed 's/\//\\\//g')
SED_CHANGELOG = sed "s/@CHANGELOG/${CHANGELOG}/"


main.js : ${SOURCE_FILES}
	@cat ${SOURCE_FILES} | ${SED_DATE} | ${SED_VER} > $@
	@cp $@ ../js/

manifest.json : manifest_base.json version.txt
	@cat manifest_base.json | ${SED_VER} > $@
	@cp $@ ../

index.html : index_base.html changelog.txt
	@cat index_base.html | ${SED_CHANGELOG} > $@
	@cp $@ ../

all:
	make main.js
	make manifest.json
	make index.html

