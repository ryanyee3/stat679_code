
function parse_row(d) {
  return {
    country: d.country,
    year: +d.year,
    lpop: +d.lpop,
    life_expectancy: +d.life_expectancy
  }
}

function visualize(data) {
  initialize(data, year);
}

function initialize(data, year) {
  data = data.filter(d => d.year == year)
  console.log(data)

  d3.select("svg")
    .selectAll("circle")
    .data(data).enter()
    .append("circle")
    .attrs({
      cx: d => 10 * d.lpop,
      cy: d => d.life_expectancy
     })
}


year = 1965
d3.csv("gapminder.csv", parse_row)
  .then(visualize);
