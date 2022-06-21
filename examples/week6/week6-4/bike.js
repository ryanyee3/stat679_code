

function visualize(data) {
  let scales = make_scales();
  initialize(data, scales)
  setup_brushes(data, scales)
}

function initialize(data, scales) {
  d3.select("#scatter")
    .selectAll("circle")
    .data(data["scatter"]).enter()
    .append("circle")
    .attrs({
      cx: d => scales.x(d.temp) + jitter(),
      cy: d => scales.y(d.hum) + jitter()
    })

  let path = d3.line()
    .x(d => scales.hour(d.hr))
    .y(d => scales.count(d.count));
  d3.select("#series")
    .selectAll("path")
    .data(data["series"]).enter()
    .append("path")
    .attrs({
      d: path
    })
}

function update(scales) {
}

function setup_brushes(data, scales) {
  let brush = d3.brush()
    .extent([[width - 100, 0], [width, 100]])
    .on("brush", ev => brush_update(ev, scales));

  d3.select("#context")
    .append("g")
    .attr("class", "brush")
    .call(brush)
}

function brush_update(ev, scales) {
}

function make_scales() {
  // scatterplot data are already scaled
  return {
    hour: d3.scaleLinear()
      .domain([0, 23])
      .range([0, 600]),
    count: d3.scaleLinear()
      .domain([0, 1000])
      .range([height, 0]),
    x: d3.scaleLinear()
      .domain([0, 1])
      .range([0, 300]),
    y: d3.scaleLinear()
      .domain([0, 1])
      .range([300, 0])
  }
}

let width = 900,
    height = 300,
    jitter = d3.randomUniform(-2, 2);

d3.json("bike.json")
  .then(visualize)
//data.then(d => visualize(d));
