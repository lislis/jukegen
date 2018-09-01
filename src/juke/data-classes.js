export class DataArray extends Array {
  randomElement() {
    return this[Math.floor(Math.random() * this.length)];
  }
}

export class DataObject extends Object {
  randomPropertyKey() {
    let result = 'randomProperty';
    while(result === 'randomProperty') {
      let count = 0;
      for (var prop in this)
        if (Math.random() < 1/++count)
          result = prop;
    }
    return result;
  }
  randomProperty() {
    return this[this.randomPropertyKey()];
  }
}
