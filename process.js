const fs       = require('fs');
const readline = require('readline');




// Get the number of rows, columns, and size of graph in Matrix Market format.
async function readMtxSizes(pth) {
  const fin  = fs.createReadStream(pth);
  const flin = readline.createInterface({input: fin, crlfDelay: Infinity});
  var   rows = 0, cols = 0, size = 0;
  for await (const line of flin) {
    if (line[0] === '%') continue;
    var [rows, cols, size] = line.trim().split(/\s+/).map(w => parseInt(w, 10));
    break;
  }
  flin.close();
  fin.close();
  return [rows, cols, size];
}


// Convert Matrix Market format to plain EdgeList format (without vertex/edge counts).
async function convertMtxToEdgelist(pin, pout) {
  const fin  = fs.createReadStream(pin);
  const fout = fs.createWriteStream(pout);
  const flin = readline.createInterface({input: fin, crlfDelay: Infinity});
  var   skip = true;
  for await (const line of flin) {
    if (line[0] === '%') continue;
    if (skip) { skip = false; continue; }
    fout.write(line + '\n');
  }
  flin.close();
  fin.close();
  fout.close();
}




// Main function.
async function main(cmd, pin, pout) {
  switch (cmd) {
    case 'read-mtx-rows':
      const [rows] = await readMtxSizes(pin);
      console.log(rows);
      break;
    case 'read-mtx-cols':
      const [, cols] = await readMtxSizes(pin);
      console.log(cols);
      break;
    case 'read-mtx-size':
      const [,, size] = await readMtxSizes(pin);
      console.log(size);
      break;
    case 'convert-mtx-to-edgelist':
      pout = pout || pin.replace(/\.mtx$/, '.edgelist');
      await convertMtxToEdgelist(pin, pout);
      break;
    default:
      console.error(`error: "${cmd}"?`);
      break;
  }
};
main(...process.argv.slice(2));
