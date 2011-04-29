#! /bin/sh
./js/main.copy.js: ./js/main.js
	#./pack.sh
	./replace.js
	#java -jar ../closurecompiler/compiler.jar --js=./js/main.js --js_output_file=./js/main.min.js
