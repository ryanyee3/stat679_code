
function parse_row(d) {
  return {
    country: d.country,
    year: +d.year,
    lpop: +d.lpop,
    life_expectancy: +d.life_expectancy
  }
}

d3.csv("gapminder.csv", parse_row)
  .then(data => console.log(data));
