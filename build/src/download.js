const fs = require('fs');

const path = require('path');

const rootDir = 'scraper-downloads';

module.exports.writeJSONFile = async ({
  json,
  fileName
}) => {
  try {
    await fs.writeFileSync(`${rootDir}/${fileName}.json`, JSON.stringify(json, null, 2), {
      // Open file for writing. The file is created (if it does not exist) or truncated (if it exists).
      flag: 'w'
    });
  } catch (err) {
    if (err.code === 'ENOENT') {
      await fs.mkdir('scraper-downloads', err => null);
      module.exports.writeJSONFile({
        json,
        fileName
      });
    }
  }
};