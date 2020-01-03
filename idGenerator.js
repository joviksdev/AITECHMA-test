module.exports = function() {
  this.length = 10;

  this.time_stamp = +new Date();

  const getRandomInt = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  this.generate = function() {
    const ts = this.time_stamp.toString();
    const parts = ts.split('').reverse();
    let id = '';

    for (let i = 0; i < this.length; i++) {
      const index = getRandomInt(0, parts.length - 1);

      id += parts[index];
    }

    return id;
  };
};
