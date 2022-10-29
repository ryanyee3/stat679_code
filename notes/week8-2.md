---
title: Temporal Interaction
layout: post
output:
  md_document:
    preserve_yaml: true
---

*Introducing interactivity to time series visualization*

1.  Temporal data often have high information density, making
    interactivity worthwhile. In these notes, we’ll review some of the
    general principles of temporal interactivity discussed in the
    reading before illustrating with a few examples.

2.  It is often useful to think about interactive visualization in terms
    of Norman’s “gulfs.” The gulf of interaction refers to the mental
    effort required to go from a visual query (in our heads) to a
    physical interaction (on the screen). The gulf of evaluation refers
    to the reader’s attempt to understand what has happened when the
    interface has changed. Users need to be able to traverse both gulfs
    easily. If there is too much difficulty in either defining the query
    or making sense of the result, the interaction will typically be
    ineffective.

<img src="https://github.com/krisrs1128/stat679_code/raw/main/examples/week8/week8-2/normans_gulfs.png" width=700/>

1.  One of the most useful types of interactivity in time series
    visualization is the overview + detail technique. In this approach,
    the reader is first presented with an overview of the full time
    series. They can then interactively query for details depending on
    their interest. The overview + detail technique is often referred to
    as Shneiderman’s mantra: “Overview first, then details on demand.”

2.  For example, in the example below, we’ve built an overview + detail
    version of our Gantt chart from the previous lecture. The idea is to
    reduce multiple events into a larger group. For example, we could
    use this to collapse many short subtasks in a project into one
    larger, longer-term task. This implements a form of the
    details-on-demand principle. We’ll implement a simple version of
    this that collapses all events in the chart. The main idea is to
    define a variable, called `collapsed` below, that stores whether or
    not the chart is currently collapsed. Whenever a button is clicked,
    we trigger an event that reverses the value of that variable. We
    then either expand or overlay the events.

        function toggle_collapse(scales) {
          if (collapsed) {
            collapsed = false;
            uncollapse(scales);
          } else {
            collapsed = true;
            collapse();
          }
        }

3.  To implement the collapse, we have to select all the rectangles and
    then change their `y` coordinate attribute. We similarly move the
    group element containing the `x`-axis to the top of the plot and
    clear the tooltip. The `uncollapse()` function simply reverses this
    operation.

        function collapse() {
          d3.select("#rects")
            .selectAll("rect")
            .transition()
            .duration(1000)
            .attr("y", 0)

          d3.select("#x_axis")
            .transition()
            .duration(1000)
            .attr("transform", "translate(0, 8)")

          d3.select("#tooltip").select("text").text("")
        }

    <iframe src="https://krisrs1128.github.io/stat679_code/examples/week8/week8-1/gantt2.html" height=400 width=500 style="text-align: center"></iframe>

4.  Another form of overview + detail can be implement by linked
    brushing. We can brush to focus in on specific time windows of
    interest, while never losing the context of the overall time series
    shape. This is implemented in the following example, by Mike
    Bostock,

<iframe width="100%" height="633" frameborder="0" src="https://observablehq.com/embed/@d3/focus-context?cells=chart%2Cviewof+focus">
</iframe>

1.  It is also common to use linked brushing to define queries based on
    attributes of the time series. This was used in our earlier bike
    sharing example, where we linked daily bike demand with the day’s
    weather.

<iframe src="https://krisrs1128.github.io/stat679_code/examples/week6/week6-4/bike.html" width="700" height="320">
</iframe>

1.  Finally, we can query series based on summaries of each series. For
    example, we could have queried the time series based on their
    overall trend. The histogram below gives the slopes across series in
    the Opioid Atlas dataset. Hovering over points on the left hand
    histogram highlights countries with the largest changes over time.

<iframe width="560" height="315" src="https://www.youtube.com/embed/LGf1FyTytTw" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen>
</iframe>

Indeed, slope is just one statistic that can be used to navigate a
collection of time series. There is a small literature on summary
statistics for time series. [`feasts`](https://feasts.tidyverts.org/) is
a useful R package for extracting these kinds of statistics.
