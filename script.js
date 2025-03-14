import * as Plot from "https://cdn.jsdelivr.net/npm/@observablehq/plot@0.6/+esm";
import { feature } from "https://cdn.jsdelivr.net/npm/topojson@3/+esm";
import { json, csv } from "https://cdn.jsdelivr.net/npm/d3-fetch@3/+esm";

const nation = await json(
  "https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json"
).then((us) => feature(us, us.objects.nation));
const statemesh = await json(
  "https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json"
).then((us) => feature(us, us.objects.states));

const libraries = await csv("data/sample.csv");

const plot = Plot.plot({
  projection: "albers-usa",
  marks: [
    Plot.geo(nation, { fill: "lightgray" }),
    Plot.geo(statemesh, { strokeOpacity: 0.2 }),
    Plot.dot(libraries, {
      x: "longitude",
      y: "latitude",
      fill: "red",
      title: (d) => d.name,
      tip: true,
    }),
  ],
});

const div = document.querySelector("#myplot");
div.append(plot);
