const fs = require("node:fs");
const fsp = require("node:fs/promises");
const readline = require("readline");

const read_csv = async (file_path) => {
  const data = [];
  const headers = [];
  console.log(file_path)
  rl = readline.createInterface({
    input: fs.createReadStream(file_path),
    crlfDelay: Infinity
  });

  let index = 0;
  for await (const row of rl) {
    if (index === 0) {
      let properties = row.trim().split(",");
      for (let prop of properties) {
        headers.push(prop);
      }
      index++;
      continue;
    }
    let values = row.trim().split(",");
    let obj = {};
    for (let i = 0; i < headers.length; i++) {
      obj[headers[i]] = values[i];
    }
    data.push(obj);
  }

  const kb = (((await (await fsp.stat(file_path)).size )* 0.001)).toFixed(2);

  /* fs.unlink(file_path, (err) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log('File has been deleted.');
  }); */

  return {data, kb};
};

module.exports = read_csv;