---
title: Structured Graphs
layout: post
output: 
  md_document:
    preserve_yaml: true
---

*Representing known structure in graphs*

1.  Graph layouts can often benefit from additional information known
    about the structure of the graph or purpose of the visualization.
    These notes describe a few of the situations that arise most
    frequently in practice.

2.  When there is no additional structure / specific purpose, a
    reasonable default for node-link diagrams uses force-directed
    layout. In this layout, we think of nodes as particles that want to
    repel one another, but which are tied together by elastic edges. In
    ggraph, this can be specified by the `force` layout.

    In D3, we can use the `d3.force()` function. This animates the
    physical system as it settles into an equilibrium state. These can
    be visually attractive, but be careful when using this, since the
    animation serves no specific visual purpose.

3.  One common situation where we can go beyond force-directed graphs is
    when we have additional information about the nodes that can be used
    to constrain their position. For example, the Royal Constellations
    visualization, attempts to visualize the family trees of royal
    families. On the y-axis, the nodes are constrained to be sorted by
    year, and across the x-axis, nodes are constrained according to the
    country of the royal family.

4.  More generally, we can define x and y-axis constraints and then use
    a force-directed algorithm to layout the nodes, subject to those
    constraints. These can be easily implemented by combining D3 with
    the cola library.

5.  The key line in the example above is
    `.constraints(graph.constraints)`. This takes a dictionary of pixel
    constraints between pairs of nodes; e.g.,
    `{"axis":"y", "left":0, "right":1, "gap":25}` says that node 1
    should be (at least) 25 pixels above node 0.

6.  Another common situation is that the nodes can be organized into a
    hierarchy of subgraphs. That is, nodes can be partitioned into
    non-overlapping sets. These sets can themselves be merged together
    to define a coarser partition.

7.  This hierarchical structure can be encoded in either node-link or
    adjacency matrix visualizations. For example, in node-link views, we
    can draw shapes enclosing the sets,

    and in adjacency matrices, we can draw trees specifying the
    hierarchy.

8.  We can in fact use the cola library to encode hierarchy in node-link
    views. The example below uses cola to ensure sets don’t overlap. It
    then draws (and fills in) paths that contain the separate sets.

9.  In some graphs, we have clustering structure. Within each cluster,
    nodes are densely connected, but between clusters, there are only a
    few links. In this case, it’s natural to use adjacency matrices to
    visualize the clusters and then draw links for connections between
    adjacency matrices. The reasoning is that adjacency matrices are
    better suited in densely connected graphs (they don’t have the edge
    crossing problem) but node-link encodings are better when we want to
    follow longer paths across clusters.

10. This is just one example of a larger class of “hybrid” matrix
    encodings. It’s possible to solve a variety of visual problems, just
    by cleverly combining the elementary visual encodings discussed last
    week.

11. So far, we have focused on high-level properties of the graph that
    can be accounted for in visualization. Sometimes, the intended
    function of the visualization warrants thinking at a low-level
    instead. For example, in many problems, we are interested in
    studying ego-networks — the small neighborhoods that surround
    specific nodes of interest.

12. One example of a layout that was designed to support ego-network
    visualization is the egoCompare system. This is a kind of overview +
    detail graph visualization where users can select pairs of nodes to
    compare within an overview graph. The 2-nearest-neighbor graphs for
    each of these selected nodes are then shown (and linked together, if
    applicable). The subgraphs are arranged in a way that minimizes the
    amount of crossing.

13. The last type of graph we’ll consider in these notes are dynamic
    graphs. These are graphs where the sets of nodes and links are
    evolving over time. For example, the interactions between proteins
    in a protein interaction network may change when a cell is exposed
    to environmental stress, like the presence of a virus.

14. There is no single way to visualize these networks, but common
    strategies include use of animation, faceting over time, combined
    encodings (like time series within nodes), or coordinated views.

15. In these notes, we’ve see some academic literature on visualization.
    Even for those of us who are more practically oriented, this
    literature can be worth being familiar, if only because it can be a
    treasure trove of visual problem solving devices.
