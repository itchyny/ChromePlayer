viewname ("prelude.js");
test ("existence", function() {
  expect(3);
  ok( Array.prototype.shuffle, "Array.prototype.shuffle()" );
  ok( Array.prototype.unique, "Array.prototype.unique()" );
  ok( $.fn.texttitle, "$.fn.texttitle()" );
});

test ("Array.prototype.shuffle", function () {
  var x = [1,3,5,7,9];
  var y = [1,3,5,7,9];
  x.shuffle ();
  equal (x.length, y.length, "Length doesn't change with shuffle");
});

test ("Array.prototype.unique", function () {
  var x = [1,3,5,7,9,11,13,15,17,19]; 
  var y = [1,3,5,7,9,11,13,15,17,19]; 
  x = x.unique ();
  deepEqual (x, y, "Nothing change with unique");

  var z = [1,1,1,1,1,1,1,1,1,1,1
          ,3,3,3,3,3,3,3,3,3,3,3
          ,5,5,5,5,5,5,5,5,5,5,5
          ,7,7,7,7,7,7,7,7,7,7,7
          ,9,9,9,9,9,9,9,9,9,9,9
          ,11,13,15,17,19];
  z = z.unique ();
  deepEqual (x, z, "Remove same elements");
});



