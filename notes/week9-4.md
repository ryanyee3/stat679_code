---
title: Graph Representations
layout: post
output: 
  md_document:
    preserve_yaml: true
---

*Visual marks for general graphs*

1.  In these notes, we’ll discuss how to implement a few basic types of
    general graph visualizations using R and javascript. For R, we’ll
    focus on ggraph, and for javascript, we’ll use D3’s graph layout
    functions.

2.  The goal of the ggraph package is to provide ggplot2-like design
    iteration for graph structured (rather than tabular) data. Like
    ggplot2, visualizations are built by composing layers for separate
    visual marks. Scale and labeling functions are also available to
    customize the appearance of these marks.

3.  For example, to build a node-link visualization, we can use the
    `geom_node` and `geom_edge_link` layers. Note that `ggraph` expects
    a `tbl_graph` as input, not simply a `data.frame`.

4.  Attributes of nodes and edges can be encoded using size (node radius
    or edge width) or color. The node-link representation is especially
    effective for the task of following paths. It’s an intuitive
    visualization for examining the local neighborhood of one node or
    describing the shortest path between two nodes.

5.  Let’s make the analogous graph in D3. We first read in the JSON’s
    associated the nodes and edges.

    We can then use d3’s force-directed layout algorithm to compute a
    layout of the nodes given a connectivity structure. The algorithm
    simulates forces that try to repel nodes from each other, while
    tension on the edges keeps connected ones close to one another. It
    is just one of many layout algorithms, some of which we’ll review in
    the next lecture.

6.  The key drawback of node-link diagrams is that they do not scale
    well to networks with a large number of nodes or with a large number
    of edges per node. The nodes and edges begin to overlap too much,
    and the result looks like a “hairball.”

7.  In this case, it’s often useful to try filtering or aggregating
    nodes. For example, aggregation works by replacing the original
    nodes with metanodes representing entire clusters. This is
    especially powerful if the degree of filtering or aggregation can be
    adjusted interactively — we’ll explore this strategy when we study
    interactivity for graph visualization.

8.  Alternatively, another way to solve the hairball problem is to use
    an adjacency matrix visualization instead. The adjacency matrix of a
    graph is the matrix with a 1 in entry ij if nodes i and j are linked
    by an edge and 0 otherwise. It has one row and one column for every
    node in the graph. Visually, these 1’s and 0’s can be encoded as a
    black and white squares.

9.  The example below shows the adjacency matrix associated with the
    high-school student friendship network from last lecture. We use the
    “matrix” layout with a `geom_edge_tile` layer to draw adjacency
    matrices in ggraph.

10. In D3, an adjacency matrix visualization is simply a collection of
    appropriately placed SVG `rect`s.

11. Note that we have to associate each node with both an x and a y
    coordinate and that the visualization is dependent on the choice of
    ordering. There are a variety of algorithms available for ordering
    nodes in an adjacency matrix, but implementing this manually can be
    tedious. Fortunately, there is a javascript package (reorder.js)
    that specifically supports these algorithms.

12. The key advantage of visualization using adjacency matrices is that
    they can scale to large and dense networks. It’s possible to
    perceive structure even when the squares are quite small, and there
    is no risk of edges overlapping with one another.

13. The key disadvantage of adjacency matrix visualization is that it’s
    challenging to make sense of the local topology around a node.
    Finding the « friends of friends » of a node requires effort.
    Another issue is that different orderings of rows and columns can
    have a dramatic effect on the structure that’s visible.
