
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
  choropleth(geo, ts)
  line_plot(ts, scales)
}

function line_plot(ts, scales) {
  let line_gen = d3.line()
    .x(d => scales.x(d.date))
    .y(d => scales.y(Math.sqrt(d.calfresh)))

  d3.select("#ts")
    .selectAll("path")
    .data([ts[0]]).enter()
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

function choropleth(geo, ts) {
  let proj = d3.geoMercator()
    .fitSize([width / 2, height], geo)
  let path = d3.geoPath()
    .projection(proj);

  d3.select("#map")
    .selectAll("path")
    .data(geo.features).enter()
    .append("path")
    .attrs({
      d: path,
      fill: "#F2F2F2"
    })
    .on("mouseover", (ev, d) => update_display(ev, d, ts))
}

function update_map(d) {
  d3.select("#map")
    .selectAll("path")
    .attrs({
      fill: e => {
        return e.properties.county == d.properties.county ? "#595959" : "#F2F2F2"
      }
    })
}

function update_label(d) {
  d3.select("#label text")
    .text(d.properties.county)
}

function update_display(ev, d, ts) {
  update_label(d)
  update_map(d)
  update_ts(ev, d, ts)
}

function update_ts(ev, d, ts) {
  cur_ts = ts.filter(e => e[0].county == d.properties.county)
  scales = make_scales(cur_ts)

  let line_gen = d3.line()
    .x(d => scales.x(d.date))
    .y(d => scales.y(Math.sqrt(d.calfresh)))

  d3.select("#ts")
    .selectAll("path")
    .data(cur_ts)
    .transition().duration(transition_length)
    .attrs({
      d: line_gen,
      "stroke-opacity": 1
    })

  d3.select("#y_axis")
    .transition().duration(transition_length)
    .call(d3.axisLeft(scales.y).ticks(4))
}

function make_scales(ts) {
  return {
    x: d3.scaleLinear()
      .domain(d3.extent(ts[0].map(d => d.date)))
      .range([0, width / 2]),
    y: d3.scaleLinear()
      .domain(d3.extent(ts[0].map(d => Math.sqrt(d.calfresh))))
      .range([0.8 * height, 0.5 * height])
  }
}

let transition_length = 1000;
Promise.all([
  d3.csv("calfresh.csv", d3.autoType),
  d3.json("counties.geojson")
]).then(visualize)
