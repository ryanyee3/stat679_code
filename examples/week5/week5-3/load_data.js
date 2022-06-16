
function parse_row(d) {
  return {
    country: d.country,
    year: +d.year,
    lpop: +d.lpop,
    life_expectancy: +d.life_expectancy
  }
}

function visualize(data) {
  data = data.filter(d => d.year == 1965)
  d3.select("svg")
    .selectAll("circle")
    .data(data).enter()
    .append("circle")
    .attrs({
      cx: d => 10 * d.lpop,
      cy: d => d.life_expectancy,
      r: 10
     })
}

d3.csv("gapminder.csv", parse_row)
  .then(visualize);
