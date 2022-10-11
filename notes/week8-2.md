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
    interface has changed.

<img src="https://github.com/krisrs1128/stat679_code/raw/main/examples/week8/week8-2/normans_gulfs.png" width=700/>

1.  Users need to be able to traverse both gulfs easily. If there is too
    much difficulty in either defining the query or making sense of the
    result, the interaction will typically be ineffective.

2.  One of the most useful types of interactivity in time series
    visualization is the overview + detail technique. In this approach,
    the reader is first presented with an overview of the full time
    series. They can then interactively query for details depending on
    their interest. The overview + detail technique is often referred to
    as Shneiderman’s mantra: “Overview first, then details on demand.”

3.  For example, in the example below, we’ve built an overview + detail
    version of our gantt chart from the previous lecture. In the
    overview, we only see the high-level tasks and their timelines. When
    we click on any of the parent tasks, they expand into all their
    subtasks.

    \[Example with gantt chart\]

4.  Another form of overview + detail can be implement by linked
    brushing. We can brush to focus in on specific time windows of
    interest, while never losing the context of the overall time series
    shape.

    \[Example with focus + context time series\]

5.  It is also common to use linked brushing to define queries based on
    attributes of the time series. This was used in our earlier bike
    sharing example, where we linked daily bike demand with the day’s
    weather..

<iframe src="https://krisrs1128.github.io/stat679_code/examples/week6/week6-4/bike.html" width="700" height="320">
</iframe>

1.  Finally, we can query series based on summaries of each series. For
    example, we can query time series based on their overall trend. The
    histogram below gives the slopes across all the series. Brushing the
    right hand side of the series highlights those with the largest
    increases in slope.

2.  Slope is just one statistic that can be used to navigate a
    collection of time series. There is a small literature on summary
    statistics for time series.
    [`feasts`](https://feasts.tidyverts.org/) is a useful R package for
    extracting these kinds of statistics.
