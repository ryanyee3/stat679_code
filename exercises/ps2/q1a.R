
library(lubridate)
library(shiny)
library(tidyverse)
my_theme <- theme_bw() +
  theme(
    panel.background = element_rect(fill = "#f7f7f7"),
    panel.grid.minor = element_blank(),
    axis.ticks = element_blank(),
    plot.background = element_rect(fill = "transparent", colour = NA)
  )
theme_set(my_theme)

traffic <- read_csv("https://uwmadison.box.com/shared/static/x0mp3rhhic78vufsxtgrwencchmghbdf.csv") %>%
  mutate(day_of_week = wday(date))

plot_traffic <- function(df) {
  ggplot(df) +
    geom_line(aes(date, value, group = name)) +
    labs(x = "Date", y = "Traffic") +
    theme(axis.title = element_text(size = 20))
}

ui <- fluidPage(
  selectInput("city", "City", unique(traffic$name), multiple = TRUE),
  plotOutput("time_series")
)

server <- function(input, output) {
  output$time_series <- renderPlot({
    traffic %>%
      filter(name %in% input$city) %>%
      plot_traffic()
  })
}

shinyApp(ui, server)