var assert = chai.assert;

describe('montecarloDist', function() {
  it('should return a value between 0 and 1', function() {
    assert.isAtMost(montecarloDist(), 1);
    assert.isAtLeast(montecarloDist(), 0);
  });
});
