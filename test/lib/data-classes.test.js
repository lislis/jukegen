var assert = chai.assert;

describe('DataArray#randomElement', function() {
  it('should return a random element from array', function() {
    let arr = new DataArray(1, 2, 3, 4);
    assert.notEqual(arr.indexOf(arr.randomElement()), -1);
  });
});

describe('Object#randomPropertyKey', function() {
  it('should return a random property key from object', function() {
    let obj = {foo: 'lol', bar: 'lol', baz: 123};
    assert.notEqual(obj[obj.randomPropertyKey()], undefined);
    assert.notEqual(obj[obj.randomPropertyKey()], 'randomProperty');
    assert.notEqual(obj[obj.randomPropertyKey()], 'randomPropertyKey');
  });
});

describe('Object#randomPropertyKey', function() {
  it('should return a random property key from object', function() {
    let obj = {foo: 'lol', bar: 'lol', baz: 123};
    assert.notEqual(obj[obj.randomPropertyKey()], undefined);
  });
});
