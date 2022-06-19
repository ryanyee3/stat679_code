
function visualize(data) {
  data = data.filter(d => d.imdb > 0 & d.rotten > 0);
  let scales = make_scales(data)
  initialize(data, scales);
}

function initialize(data, scales) {
  d3.select("#circles")
    .selectAll("circle")
    .data(data, d => d.title).enter()
    .append("circle")
    .attrs({
      class: "selected",
      cx: d => scales.x(d.imdb),
      cy: d => scales.y(d.rotten),
      fill: d => scales.fill(d.genre)
    })

  annotations(scales)
  legend(scales.fill)
}

function legend(scale) {
  let legend = d3.legendColor()
  .title("Genre")
  .scale(scale);

  d3.select("#legend")
    .attr("transform", `translate(${0.7 * width}, ${margins.top})`)
    .call(legend);

  d3.select("#legend .legendCells")
    .selectAll(".cell")
    .on("click", (ev, d) => toggle_selection(ev, d))
}

function toggle_selection(ev, d) {
  let ix = selected.indexOf(d)
  if (ix == -1) {
    selected.push(d);
  } else {
    selected.splice(ix, 1)
  }
  update_view()
}

function update_view() {
  d3.select("#circles")
    .selectAll("circle")
    .attr("class", (d) => selected.indexOf(d.genre) == -1 ? "deselected" : "selected")

console.log(selected)
  d3.select(".legendCells")
    .selectAll("rect")
    .attr("opacity", (d) => selected.indexOf(d) == -1 ? 0.4 : 1)
  d3.select(".legendCells")
    .selectAll("text")
    .attr("opacity", (d) => selected.indexOf(d) == -1 ? 0.4 : 1)
  }

function annotations(scales) {
  let x_axis = d3.select("#axes").append("g")
      y_axis = d3.select("#axes").append("g"),
      x_title = d3.select("#axes").append("text"),
      y_title = d3.select("#axes").append("text");

  x_axis.attr("transform", `translate(0, ${height - margins.bottom})`)
    .call(d3.axisBottom(scales.x).ticks(4))
  y_axis.attr("transform", `translate(${margins.left}, 0)`)
    .call(d3.axisLeft(scales.y).ticks(4))

  x_title.text("IMDB")
    .attrs({
      class: "label_title",
      transform: `translate(${0.5 * width}, ${height - 0.25 * margins.bottom})`,
    })
  y_title.text("Rotten Tomatoes")
    .attrs({
      class: "label_title",
      transform: `translate(${0.25 * margins.left}, ${0.5 * height})rotate(-90)`
    });
}

function make_scales(data) {
  return {
    x: d3.scaleLinear()
         .domain(d3.extent(data.map(d => d.imdb)))
         .range([margins.left, 0.7 * width - margins.right]),
    y: d3.scaleLinear()
         .domain(d3.extent(data.map(d => d.rotten)))
         .range([height - margins.bottom, margins.top]),
    fill: d3.scaleOrdinal()
      .domain([... new Set(data.map(d => d.genre))])
      .range(d3.schemeSet2)
  }
}

function parse_row(d) {
  return {
    title: d.Title,
    imdb: +d.IMDB_Rating,
    rotten: +d.Rotten_Tomatoes_Rating,
    genre: d.Genre_Group
  }
}

let width = 700,
  height = 500,
  selected = ["Drama", "Other", "Musical", "Comedy", "Action", "Romantic Comedy",
              "Adventure", "Thriller/Suspense", "Horror"],
  margins = {left: 60, right: 60, top: 60, bottom: 60};
d3.csv("movies.csv", parse_row)
  .then(visualize);
