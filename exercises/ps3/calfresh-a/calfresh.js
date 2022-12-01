
let width = 600,
  height = 200;

function reshape_ts(data) {
  let counties = {}
  for (let i = 0; i < data.length; i++) {
    counties[data[i].county] = []
  }

  for (let i = 0; i < data.length; i++) {
    counties[data[i].county].push({
      date: data[i].date,
      calfresh: data[i].calfresh,
      county: data[i].county
    })
  }

  return Object.values(counties)
}

function visualize(ts_long) {
  ts = reshape_ts(ts_long)
  scales = make_scales(ts.filter(d => d[0].county == "Los Angeles"))
  line_plot(ts, scales)
}

function line_plot(ts, scales) {
  let line_gen = d3.line()
    .x(d => scales.x(d.date))
    .y(d => scales.y(Math.sqrt(d.calfresh)))

  d3.select("#ts")
    .selectAll("path")
    .data(ts).enter()
    .append("path")
    .attrs({
      d: line_gen,
    })

  let axis = {
    x: d3.axisBottom(scales.x),
    y: d3.axisLeft(scales.y).ticks(4)
  }

  d3.select("#x_axis").call(axis.x)
  d3.select("#y_axis").call(axis.y)
}

function make_scales(ts) {
  return {
    x: d3.scaleLinear()
      .domain(d3.extent(ts[0].map(d => d.date)))
      .range([0, width / 2]),
    y: d3.scaleLinear()
      .domain([0, d3.max(ts[0].map(d => Math.sqrt(d.calfresh)))])
      .range([height, 0])
  }
}

let transition_length = 1000;
d3.csv("calfresh.csv", d3.autoType)
  .then(visualize)
