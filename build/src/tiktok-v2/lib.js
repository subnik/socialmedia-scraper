module.exports.userAgents = ["Applebot", "Bingbot", "DuckDuckBot", "Yeti", "Twitterbot", "Yandex"];

module.exports.withExTime = promise => new Promise(async (resolve, reject) => {
  const start = new Date();
  let res = null;

  try {
    res = await promise;
  } catch (err) {
    reject(err);
  }

  const end = new Date() - start;
  console.info('Execution time: %dms', end);
  resolve(res);
});

module.exports.arrayRandom = array => {
  return array[Math.floor(Math.random() * array.length)];
};