
let width = 600,
  height = 600;

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

function visualize(data) {
  [ts_long, geo] = data
  ts = reshape_ts(ts_long)
  scales = make_scales(ts)
  choropleth(geo, ts, scales)
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
      "stroke-opacity": 0
    })

  let axis = {
    x: d3.axisBottom(scales.x),
    y: d3.axisLeft(scales.y).ticks(4)
  }

  d3.select("#x_axis").call(axis.x)
  d3.select("#y_axis").call(axis.y)
}

function county_means(ts) {
  let means = {}
  for (let i = 0; i < ts.length; i++) {
    means[ts[i][0].county] = d3.mean(ts[i].map(d => Math.sqrt(d.calfresh)))
  }

  return means;
}

function choropleth(geo, ts) {
  let proj = d3.geoMercator()
    .fitSize([width / 2, height], geo)
  let path = d3.geoPath()
    .projection(proj)
  let means = county_means(ts)

  d3.select("#map")
    .selectAll("path")
    .data(geo.features).enter()
    .append("path")
    .attrs({
      d: path,
      fill: d => scales.fill(means[d.properties.county]),
      "stroke-width": 0.5
    })
}

function make_scales(ts) {
  return {
    x: d3.scaleLinear()
      .domain(d3.extent(ts[0].map(d => d.date)))
      .range([0, width / 2]),
    y: d3.scaleLinear()
      .domain([0, 890])
      .range([0.8 * height, 0.5 * height]),
    fill: d3.scaleLinear()
      .domain([0, 850])
      .range(["#F2F2F2", "#595959"])
  }
}

let transition_length = 1000;
Promise.all([
  d3.csv("calfresh.csv", d3.autoType),
  d3.json("counties.geojson")
]).then(visualize)
