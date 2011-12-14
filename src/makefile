SOURCE_FILES =\
	_header.js \
	prelude.js \
	message.js \
	limited.js \
	enum.js \
	enumlinear.js \
	enumcycle.js \
	enumdinamic.js \
	id3.js \
	id3-minimized.js \
	music.js \
	local.js \
	schemeconfig.js \
	ui.js \
	key.js \
	command.js \
	player.js \
	keyconfig.js \
	globalcontrol.js \
	_footer.js

BG_SOURCE_FILES =\
	_header.js \
	prelude.js \
	message.js \
	notification.js \
	limited.js \
	enum.js \
	enumlinear.js \
	enumcycle.js \
	enumdinamic.js \
	music.js \
	local.js \
	schemeconfig.js \
	key.js \
	command.js \
	bg_player.js \
	_footer.js


DATE=$(shell TZ=GMT date '+%Y\/%m\/%d %T (GMT)')
SED_DATE = sed "s/@DATE/${DATE}/"

VERSION = $(shell cat version.txt)
SED_VER = sed "s/@VERSION/${VERSION}/"

CHANGELOG = $(shell cat changelog.txt |\
                    sed 's/&/\\\&amp;/g' |\
                    sed 's/</\\\&lt;/g' |\
                    sed 's/>/\\\&gt;/g' |\
                    sed 's/\"/\\\&quot;/g' |\
                    sed 's/^/<br \/>/' |\
                    sed 's/<br \/>v1.0/v1.0/' |\
                    sed 's/\//\\\//g')
SED_CHANGELOG = sed "s/@CHANGELOG/${CHANGELOG}/"


main.js : ${SOURCE_FILES}
	@cat ${SOURCE_FILES} | ${SED_DATE} | ${SED_VER} | node closure-command.js  > $@
	@cp $@ ../js/

bg_main.js : ${BG_SOURCE_FILES}
	@cat ${BG_SOURCE_FILES} | ${SED_DATE} | ${SED_VER} | node closure-command.js  > $@
	@cp $@ ../js/

manifest.json : manifest_base.json version.txt
	@cat manifest_base.json | ${SED_VER} > $@
	@cp $@ ../

index.html : index_base.html changelog.txt
	@cat index_base.html | ${SED_CHANGELOG} > $@
	@cp $@ ../

bg_index.html : bg_index_base.html
	@cat bg_index_base.html > $@
	@cp $@ ../

all:
	make main.js
	make bg_main.js
	make manifest.json
	make index.html
	make bg_index.html

