
library(shiny)
library(tidyverse)
library(bslib)
my_theme <- theme_bw() +
  theme(
    panel.background = element_rect(fill = "#f7f7f7"),
    panel.grid.minor = element_blank(),
    axis.ticks = element_blank(),
    plot.background = element_rect(fill = "transparent", colour = NA),
    axis.title = element_text(size = 20),
    legend.title = element_text(size = 18),
    legend.text = element_text(size = 14),
  )
theme_set(my_theme)

rentals <- read_csv("https://uwmadison.box.com/shared/static/zi72ugnpku714rbqo2og9tv2yib5xped.csv") %>%
  mutate(trunc_price = pmin(price, 1e3))

scatterplot <- function(df, selected_) {
  df %>%
    mutate(selected = selected_) %>%
    ggplot() +
    geom_point(
      aes(
        longitude, latitude, col = room_type, 
        alpha = as.numeric(selected),
        size = as.numeric(selected)
      )
    ) +
    scale_color_manual(values = c("#3F4B8C","#F26444", "#40331D"), guide = "none") +
    scale_alpha(range = c(0.1, .5), guide = "none") +
    scale_size(range = c(0.1, .9), guide = "none") +
    coord_fixed() +
    theme_void()
}

overlay_histogram <- function(df, selected_) {
  sub_df <- filter(df, selected_)
  ggplot(df, aes(trunc_price, fill = room_type)) +
    geom_histogram(alpha = 0.3, binwidth = 25) +
    geom_histogram(data = sub_df, binwidth = 25) +
    scale_y_continuous(expand = c(0, 0, 0.1, 0)) +
    scale_fill_manual(values = c("#3F4B8C","#F26444", "#40331D")) +
    labs(
      fill = "Room Type",
      y = "Count",
      x = "Price"
    )
}

filter_df <- function(df, selected_) {
  filter(df, selected_) %>%
    select(name, price, neighbourhood, number_of_reviews) %>%
    rename(Price = price, Neighborhood = neighbourhood, `Number of Reviews` = number_of_reviews)
}

ui <- fluidPage(
  h3("NYC Airbnb Rentals"),
  fluidRow(
    column(6,
           plotOutput("histogram", brush = brushOpts("plot_brush", direction = "x"), height = 200),
           dataTableOutput("table")
    ),
    column(6, plotOutput("map", brush = "plot_brush", height = 600)),
  ),
  theme = bs_theme(bootswatch = "minty")
)

server <- function(input, output) {
  selected <- reactiveVal(rep(TRUE, nrow(rentals)))
  observeEvent(input$plot_brush, {
    selected(brushedPoints(rentals, input$plot_brush, allRows = TRUE)$selected_)
  })
  
  output$histogram <- renderPlot(overlay_histogram(rentals, selected()))
  output$map <- renderPlot(scatterplot(rentals, selected()))
  output$table <- renderDataTable(filter_df(rentals, selected()))
}

shinyApp(ui, server)