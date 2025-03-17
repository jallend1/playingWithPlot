import * as Plot from "https://cdn.jsdelivr.net/npm/@observablehq/plot@0.6/+esm";
import { feature } from "https://cdn.jsdelivr.net/npm/topojson@3/+esm";
import { json, csv } from "https://cdn.jsdelivr.net/npm/d3-fetch@3/+esm";

const nation = await json(
  "https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json"
).then((us) => feature(us, us.objects.nation));
const statemesh = await json(
  "https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json"
).then((us) => feature(us, us.objects.states));

let pauseAnimation = false;

const showAllButton = document.querySelector("#show-all");

const libraries = await csv("data/withCoordinates.csv");
const dots = [];

let marks = [
  Plot.geo(nation, { fill: "lightgray" }),
  Plot.geo(statemesh, { strokeOpacity: 0.2 }),
  Plot.dot(dots, {
    x: "longitude",
    y: "latitude",
    fill: (d, i) => (i % 2 === 0 ? "red" : "blue"),
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
    if (index < libraries.length && !pauseAnimation) {
      dots.push(libraries[index]);
      renderPlot();
      addLibraryToList(libraries[index]);
      index++;
    } else {
      clearInterval(interval);
    }
  }, 500);
}

addDotsToMap();

function addLibraryToList(library) {
  const ul = document.querySelector("#libraries");
  const li = document.createElement("li");
  li.textContent = library.name;
  li.classList.add("new-item");

  ul.insertBefore(li, ul.firstChild);
  li.offsetHeight;
  li.classList.add("show");

  // Remove the animation class after completion
  setTimeout(() => {
    li.classList.remove("new-item", "show");
  }, 300);
}

showAllButton.addEventListener("click", () => {
  showAllLibraries();
});

function showAllLibraries() {
  pauseAnimation = true;
  dots.splice(0, dots.length);
  dots.push(...libraries);
  renderPlot();
}
