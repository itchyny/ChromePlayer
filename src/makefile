SOURCE_FILES =\
	header.js \
	prelude.js \
	limited.js \
	enum.js \
	enumstate.js \
	id3.js \
	music.js \
	local.js \
	schemeconfig.js \
	ui.js \
	order.js \
	key.js \
	keyconfig.js \
	player.js \
	footer.js


DATE=$(shell git log -1 --pretty=format:%ad)
SED_DATE = sed "s/@DATE/${DATE}/"

VERSION = $(shell cat version.txt)
SED_VER = sed "s/@VERSION/${VERSION}/"

TARGET = main.js

main.js : ${SOURCE_FILES} makefile
	@cat ${SOURCE_FILES} |\
		${SED_DATE} | ${SED_VER} > ${TARGET}
	cp ./main.js ../js/

all:
	cd ../
	make all

