---
title: Spatial Interaction
layout: post
output: 
  md_document:
    preserve_yaml: true
---

*Idioms for interacting with geographic data*

1.  Maps can be information dense, so it’s often useful to make them
    interactive. These notes review some basic strategies for
    interactive spatial data visualization.

2.  A simple approach that’s often sufficient in practice is to use
    leaflet. This library creates good interactive maps using intuitive
    defaults. It offers several types of marks (marks, circles,
    polygons) and allows them to encode fields in a dataset. Note that
    its interface is more like base R than ggplot2 — we specify each
    attribute in one plot command.

3.  In the example below, we are looking at library budgets across
    Wisconsin. We can encode the average budget per library using the
    fill attribute of each polygon.

4.  Since this is done in R, we can easily embed the map within Shiny.
    For example, we can allow the user to filter counties according to
    their total library budgets.

5.  We can often dynamically query spatial data. Querying a map can
    highlight properties of samples within a geographic region.

6.  For example, let’s build a simple version of the opioid atlas. This
    is a dataset showing how global opioid prescription rates changed
    several decades, using data from the INCB. By hovering the mouse
    over individual countries, we can bring up the time series
    associated with it.

7.  Alternatively, querying linked panels can be used to identify
    regions with specified properties. This is like what we did in the
    library example above.

8.  Note that interactivity here is done like in any other D3
    visualization. We can treat the map as just another collection of
    SVG paths, and all our interaction events behave in the same way.

9.  Though it’s not exactly interaction, another common strategy for
    spatiotemporal data is animation. The major trends often become
    apparent by visualizing the flow of visual marks on the screen.

10. For example, how can we visualize where football players go on a
    field before they score a goal? One approach is to animate the
    trajectories leading up to the goal. This shows the most common
    paths and the speed at which the players run.
