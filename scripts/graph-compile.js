const fs = require("fs");
const {toFlat, toWGS} = require("as-geo-projection");
const path = require("path");


const SRC_FOLDER = `${__dirname}/resources`;
const DIST_FOLDER = path.join(__dirname, '..', 'src', 'app', '@core', 'services', 'graphs');


const epsgConvert = (coords) => toWGS(coords);
const wgsConvert = (coords) => toFlat(coords);
const coordConvert = (x, y) => wgsConvert({longitude: y, latitude: x});
const getDistanceMeters = (point1, point2) => {
  const calc = (value) => value * Math.PI / 180;
  const lon1 = calc(point1.longitude);
  const lon2 = calc(point2.longitude);
  const lat1 = calc(point1.latitude);
  const lat2 = calc(point2.latitude);

  // Haversine formula
  const dlon = lon2 - lon1;
  const dlat = lat2 - lat1;
  const a = Math.pow(Math.sin(dlat / 2), 2)
    + Math.cos(lat1) * Math.cos(lat2)
    * Math.pow(Math.sin(dlon / 2),2);

  const c = 2 * Math.asin(Math.sqrt(a));

  // Radius of earth in meters.
  const r = 6371 * 1000;

  // calculate the result
  return c * r;
}


const file = fs.readFileSync(`${SRC_FOLDER}/graph.json`).toString();
const formatter = file
  .replace(/'/g, `"`)
  .replace(/([a-zA-Z]*):/g, `"$1":`);
const pyGraph = JSON.parse(formatter);


pyGraph.nodes = pyGraph.nodes.map(n => ({...n, ...coordConvert(n.x, n.y)}));
pyGraph.links.forEach(l => {
  l.coords = [
    {
      ...pyGraph.nodes.find(n => n.id === l.source),
      id: l.source,
    },
    {
      ...pyGraph.nodes.find(n => n.id === l.target),
      id: l.target,
    }
  ];
  l.center = {
    x: (l.coords[0].x + l.coords[1].x) / 2,
    y: (l.coords[0].y + l.coords[1].y) / 2,
  };
});
pyGraph.links.forEach(l => {
  const point1 = epsgConvert(l.coords[0]);
  const point2 = epsgConvert(l.coords[1]);
  l.weight = getDistanceMeters(point1, point2);
});

fs.writeFileSync(
  `${SRC_FOLDER}/graph.const.ts`,
  // `${DIST_FOLDER}/graph.const.ts`,
  `export const GRAPH = ${JSON.stringify(pyGraph)}`
);

console.log('GRAPH PREPROCESSING SUCCESS!!!');
