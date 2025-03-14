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
const dots = [];

let marks = [
  Plot.geo(nation, { fill: "lightgray" }),
  Plot.geo(statemesh, { strokeOpacity: 0.2 }),
  Plot.dot(dots, {
    x: "longitude",
    y: "latitude",
    fill: "red",
    tip: true,
    title: (d) => d.name,
  }),
];

function renderPlot() {
  const plot = Plot.plot({
    projection: "albers-usa",
    marks: marks,
  });
  const div = document.querySelector("#myplot");
  div.innerHTML = "";
  div.append(plot);
}

renderPlot();

function addDotsToMap() {
  let index = 0;
  const interval = setInterval(() => {
    if (index < libraries.length) {
      dots.push(libraries[index]);
      renderPlot();
      index++;
    } else {
      clearInterval(interval);
    }
  }, 500);
}

addDotsToMap();
