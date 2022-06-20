

function visualize(data) {
  console.log(data)
  let scales = make_scales(data)
  initialize(data, scales)
  annotate()
}

function initialize(data, scales) {
  reposition(width, margins)
  d3.select("#circles0")
    .selectAll("circle")
    .data(data).enter()
    .append("circle")
    .attrs({
      cx: d => scales.x1(d.bill_depth),
      cy: d => scales.y1(d.bill_length),
      opacity: 1,
      r: 2,
      fill: d => scales.fill(d.species)
    })

  d3.select("#circles1")
    .selectAll("circle")
    .data(data).enter()
    .append("circle")
    .attrs({
      cx: d => scales.x2(d.body_mass),
      cy: d => scales.y2(d.flipper_length),
      opacity: 1,
      r: 2,
      fill: d => scales.fill(d.species)
    })

  let brushes = [
    d3.brush().on("brush", brush1),
    d3.brush().on("brush", brush2)
  ]

  for (i in brushes) {
    d3.select(`#brush${i}`).call(brushes[i])
    console.log(i)
  }
}

function brush1() {
  console.log("first brush")
}

function brush2() {
  console.log("first brush")
}

function reposition(width, margins) {
  d3.select("#plot0")
    .attr("transform", `translate(${margins.left}, ${margins.top})`)
  let plot_start = (width - margins.pad - margins.left - margins.right) / 2 + margins.left + margins.pad;
  d3.select("#plot1")
    .attr("transform", `translate(${plot_start}, ${margins.top})`)
}

function annotate() {

}

function update_views() {

}

function make_scales(data) {
  let plot_width = (width - margins.pad - margins.left - margins.right) / 2;
  return {
    x1: d3.scaleLinear()
      .domain(extent(data, "bill_depth"))
      .range([0, plot_width]),
    y1: d3.scaleLinear()
      .domain(extent(data, "bill_length"))
      .range([height - margins.bottom, margins.top]),
    x2: d3.scaleLinear()
      .domain(extent(data, "body_mass"))
      .range([0, plot_width]),
    y2: d3.scaleLinear()
      .domain(extent(data, "flipper_length"))
      .range([height - margins.bottom, margins.top]),
    fill: d3.scaleOrdinal()
      .domain(extent(data, "species"))
      .range(d3.schemeSet2)
  }
}

function parse_data(d) {
  return {
    species: d.species,
    bill_depth: +d.bill_depth_mm,
    bill_length: +d.bill_length_mm,
    body_mass: +d.body_mass_g,
    flipper_length: +d.flipper_length_mm,
  }
}

function extent(data, variable) {
  console.log(d3.extent(data.map(d => d[variable])))
  return d3.extent(data.map(d => d[variable]))
}

let height = 500,
    width = 900,
    margins = {left: 20, right: 20, top: 20, bottom: 20, pad: 80};

d3.csv("penguins.csv", parse_data)
  .then(visualize)
