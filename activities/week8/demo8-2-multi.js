
// global brushes arrays
let brushes = []

function nest(data) {
  let result = {}

  // Create object of (empty) arrays for each date
  let dates = [... new Set(data.map(d => d.date))]
  for (let i = 0; i < dates.length; i++) {
    result[dates[i]] = []
  }

  // append to the array for each date
  for (let i = 0; i < data.length; i++) {
    result[data[i].date].push(data[i])
  }

  return Object.values(result)
}

function make_scales(data, margin) {
  return {
    x: d3.scaleLinear()
      .domain([0, 23])
      .range([margin.left, 500 - margin.right]),
    y: d3.scaleLinear()
      .domain(d3.extent(data.map(d => d.pollution)))
      .range([300 - margin.bottom, margin.top])
  }
}

function draw_lines(nested, scales) {
  let path_generator = d3.line()
    .x(d => scales.x(d.hour))
    .y(d => scales.y(d.pollution))

  d3.select("#lines")
    .selectAll("path")
    .data(nested).enter()
    .append("path")
    .attrs({
      class: "plain",
      d: path_generator
    })
}

function draw_axes(scales, margin) {
  let x_axis = d3.axisBottom(scales.x)
  d3.select("#x_axis")
    .attr("transform", `translate(0, ${300 - margin.bottom})`)
    .call(x_axis)

  let y_axis = d3.axisLeft(scales.y)
  d3.select("#y_axis")
    .attr("transform", `translate(${margin.left}, 0)`)
    .call(y_axis)
}

function visualize(data) {
  let margin = {top: 10, right: 10, bottom: 20, left: 50}
  let nested = nest(data)
  let scales = make_scales(data, margin)
  draw_lines(nested, scales)
  draw_axes(scales, margin)
  new_brush(() => update_series(scales))
}

function update_series(scales) {
  d3.select("#lines")
    .selectAll("path")
    .attrs({
      class: d => check_all(d, scales) ? "highlight" : "plain"
    })
}

function check_any(d, scales, window) {
  for (let i = 0; i < d.length; i++) {
    if (scales.x(d[i].hour) > window[0][0] &
        scales.y(d[i].pollution) > window[0][1] &
        scales.x(d[i].hour) < window[1][0] &
        scales.y(d[i].pollution) < window[1][1]) {
          return true;
    }
  }
  return false;
}

function check_all(d, scales) {
  if (d === null) return false;
  for (let j = 0; j < brushes.length; j++) {
    cur_brush = d3.select(`#brush-${j}`).node()
    let window = d3.brushSelection(cur_brush)
    if (window !== null && !check_any(d, scales, window)) {
      return false;
    }
  }
  return true;
}

function new_brush(brush_fun) {
  let brush = d3.brush()
    .on("brush", brush_fun)
    .on("end", brushend);

  brushes.push(brush)
  d3.select("#brushes")
    .selectAll("g")
    .data(brushes).enter()
    .insert("g", "g")
    .attr("id", (_, i) => `brush-${i}`)

  d3.select(`#brush-${brushes.length - 1}`).call(brushes[brushes.length - 1])

  function brushend(ev) {
    let last_brush = d3.select(`#brush-${brushes.length - 1}`)
    let selection = d3.brushSelection(last_brush.node())
    if (selection) new_brush(brush_fun);
  }

  for (let i = 0; i < brushes.length; i++) {
    d3.select(`#brush-${i}`)
      .selectAll(".overlay")
      .style("pointer-events", i < brushes.length - 1 ? "none" : "all");
  }
}

d3.csv("pollution.csv", d3.autoType)
  .then(visualize)
