---
title: Manipulating Graph Data
layout: post
output: 
  md_document:
    preserve_yaml: true
---

*Reading and modifying graph data*

1.  Before diving into graph data visualization, let’s get some
    experience manipulating graphs hands on.

2.  The goal of the tidygraph package is to extend the semantics of the
    tidyverse to graph-structured data. This is necessary because any
    graph is represented by two data structures, a set of nodes and a
    set of edges.

3.  This can be usefully organized as a pair of `data.frames`, and the
    `tidygraph` structure represents graphs in exactly this way. For
    example, the two data.frames below contain node and edge attributes
    for a friendship graph.

4.  We can combine them into a single `tbl_graph` data structure using
    the `as_tbl_graph` function.

5.  The beauty of this data structure is that we can define the analogs
    of the usual tidyverse verbs for it. For example, we can derive a
    new node using `mutate`.

6.  What if we want to mutate the edges instead? We have to tell
    tidygraph to “activate” the edge set,

    \[Example with mutating edges.\]

To avoid these activate calls, a convenient shorthand is calling mutate
with `%N>%` and `%E>%`.

    [Example using these shorthands]

1.  There are many other verbs that have been defined for tidygraph
    objects. For example, we can join two graphs together.

2.  Similarly, we can filter nodes or edges based on their attributes.

3.  It’s possible to perform simple graph algorithms using these verbs.
    For example, we can cluster nodes based on their connection
    structure.

4.  We can even map over nodes to compute topological queries. For
    example, the block below computes the number of neighbors within two
    step of each node, using the `map_nodes` function.
