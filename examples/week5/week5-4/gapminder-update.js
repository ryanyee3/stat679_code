
function parse_row(d) {
  return {
    country: d.country,
    continent: d.continent,
    year: +d.year,
    lpop: +d.lpop,
    life_expectancy: +d.life_expectancy
  }
}

function visualize(data) {
  initialize(data, 1965);
}

function initialize(data, year) {
  scales = make_scales(data)
  data = data.filter(d => d.year == year)
  setup_inputs(data)

  d3.select("svg")
    .selectAll("circle")
    .data(data, d => d.country).enter()
    .append("circle")
    .attrs({
      cx: d => scales.x(d.lpop),
      cy: d => scales.y(d.life_expectancy),
      fill: d => scales.fill(d.continent)
    })
}

function update_continents(data) {
  let subset = data.filter(d => d.continent == cur_value);
  let selection = d3.select("svg").selectAll("circle")
    .data(subset, d => d.country)

  selection.enter()
    .append("circle")
    .attrs({
      cx: d => scales.x(d.lpop),
      cy: d => scales.y(d.life_expectancy),
      fill: d => scales.fill(d.continent),
    })

  selection.exit().remove()
}

function make_scales(data) {
  return {
    x: d3.scaleLinear()
         .domain([0, d3.max(data.map(d => d.lpop))])
         .range([0, 700]),
    y: d3.scaleLinear()
         .domain([0, d3.max(data.map(d => d.life_expectancy))])
         .range([0, 500]),
    fill: d3.scaleOrdinal()
      .domain([... new Set(data.map(d => d.continent))])
      .range(d3.schemeSet2)
  }
}

function setup_inputs(data) {
  d3.select("#country_select")
    .selectAll("option")
    .data([... new Set(data.map(d => d.continent))]).enter()
    .append("option")
    .text(d => d)
  d3.select("#country_select")
    .on("change", () => update_continents(data))
}

let continent = ["Americas", "Europe", "Africa", "Americas", "Asia", "Oceania"]
d3.csv("gapminder.csv", parse_row)
  .then(visualize);
