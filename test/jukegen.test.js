var assert = chai.assert;

describe('JukeGen class', function() {
  it('should return a jukegen object', function() {
    let jg = new JukeGen();
    assert.instanceOf(jg, JukeGen);
  });
});
