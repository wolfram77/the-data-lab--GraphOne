const fs = require('fs');
const os = require('os');
const path = require('path');

const RORDER = /^Global vcount = (.+)/m;
const RFAILD = /^total size = (.+)/m;
const RSIZE  = /^Batching time = (.+?) Edges = (.+)/m;
const RTLOAD = /^Make graph time = (.+)/m;
const RTVIEW = /^static View creation = (.+)/m;
const RTBFS  = /^BFS root = (.+?)Time = (.+)/m;
const GRAPHS = [
  'indochina-2004',
  'arabic-2005',
  'uk-2005',
  'webbase-2001',
  'it-2004',
  'sk-2005',
  'com-LiveJournal',
  'com-Orkut',
  'asia_osm',
  'europe_osm',
  'kmer_A2a',
  'kmer_V1r',
];




// *-FILE
// ------

function readFile(pth) {
  var d = fs.readFileSync(pth, 'utf8');
  return d.replace(/\r?\n/g, '\n');
}

function writeFile(pth, d) {
  d = d.replace(/\r?\n/g, os.EOL);
  fs.writeFileSync(pth, d);
}




// *-CSV
// -----

function writeCsv(pth, rows) {
  var cols = Object.keys(rows[0]);
  var a = cols.join()+'\n';
  for (var r of rows)
    a += [...Object.values(r)].map(v => `"${v}"`).join()+'\n';
  writeFile(pth, a);
}




// *-LOG
// -----

function readLogLine(ln, data, state) {
  if (RORDER.test(ln)) {
    if (!state) state = {};
    if (!state.graph) state.graph = GRAPHS[0];
    else state.graph = GRAPHS[(GRAPHS.indexOf(state.graph) + 1) % GRAPHS.length];
    var [, order] = RORDER.exec(ln);
    state.failed = false;
    state.order  = parseFloat(order);
    console.log(state.graph, ln);
  }
  else if (RFAILD.test(ln)) {
    var [, size] = RFAILD.exec(ln);
    state.failed = size<=0;
  }
  else if (RSIZE.test(ln)) {
    var [,, size] = RSIZE.exec(ln);
    state.size = parseFloat(size);
  }
  else if (RTLOAD.test(ln)) {
    var [, load_time] = RTLOAD.exec(ln);
    state.load_time = parseFloat(load_time);
  }
  else if (RTVIEW.test(ln)) {
    var [, view_time] = RTVIEW.exec(ln);
    state.view_time = parseFloat(view_time);
  }
  else if (RTBFS.test(ln)) {
    var [,, bfs_time] = RTBFS.exec(ln);
    if (!data.has(state.graph)) data.set(state.graph, []);
    data.get(state.graph).push(Object.assign({}, state, {
      bfs_time: parseFloat(bfs_time),
    }));
  }
  return state;
}

function readLog(pth) {
  var text  = readFile(pth);
  var lines = text.split('\n');
  var data  = new Map();
  var state = null;
  for (var ln of lines)
    state = readLogLine(ln, data, state);
  return data;
}




// PROCESS-*
// ---------

function processCsv(data) {
  var a = [];
  for (var rows of data.values())
    a.push(...rows);
  return a;
}




// MAIN
// ----

function main(cmd, log, out) {
  var data = readLog(log);
  if (path.extname(out)==='') cmd += '-dir';
  switch (cmd) {
    case 'csv':
      var rows = processCsv(data);
      writeCsv(out, rows);
      break;
    case 'csv-dir':
      for (var [graph, rows] of data)
        writeCsv(path.join(out, graph+'.csv'), rows);
      break;
    default:
      console.error(`error: "${cmd}"?`);
      break;
  }
}
main(...process.argv.slice(2));
