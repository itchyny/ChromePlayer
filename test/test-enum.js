viewname ("enum.js");

function testenum (array) {
  test ("enum " + array.join (','), function () {
    var x = new Enum (array);
    equal (x.array, array, "a.array === array");
    for (var i = 0; i < array.length; i++) {
      equal (array[i], x.toEnum (i), "array[i] === x.toEnum (i)");
    }
    for (var i = 0; i < array.length; i++) {
      equal (i, x.fromEnum (array[i]), "i === x.fromEnum (array[i])");
    }
    var val = x.toEnum (0);
  });
}

testenum ([10,20,30,40,50]);



