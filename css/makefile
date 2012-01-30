# main.css: main.less
# 	lessc -x main.less > main.css

main.css: main.stylus
	stylus -c main.stylus
	mv -f main.cssus main.css


all:
	make main.css

