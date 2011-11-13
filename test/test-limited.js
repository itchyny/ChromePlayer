viewname ("limited.js");

function testlimited (min, max, step, initializer, callback) {
  test ("limited " + min + " " + max + " " + step + " " + initializer + " ", function () {
    var x = new Limited (min, max, step, initializer, callback);

    equal (x.min <= x.max, true, "x.min < x.max");

    if (min <= initializer && initializer <= max) {
      equal (x.value, initializer, "x.value");
    }

    x.at (max);
    equal (x.value, max, "x <- max");

    x.at (min);
    equal (x.value, min, "x <- min");

    var dx = step / 20000000000;
    x.at (min - dx);
    equal (QUnit.equiv (x.value, min), true, "x <- min - dx");

    x.at (max + dx);
    equal (QUnit.equiv (x.value, max), true, "x <- max - dx");

    x.at (min);
    for (var i=0; i < (max - min) / step; i++) {
      equal (aboutEqual (x.value, min + i * step), true, "x <- min + step * i");
      x.add ();
    };
    for (var i=0; i < (max - min) / step; i++) {
      equal (aboutEqual (x.value, max - i * step), true, "x <- max - step * i");
      x.decrease ();
    };

    x.setToMin ();
    equal (x.value, min, "setToMin");
    x.setToMax ();
    equal (x.value, max, "setToMax");
  })

}

testlimited (0, 100, 1, 50); 
testlimited (0.0051, 1.2312, 0.0353, 5000);
testlimited (1.001, 1.001000001, 0.000000001, 1.0010000001);
testlimited (1.000001, 1.000001, 0.000000001, 5000);



