---
title: Tree Representations
layout: post
output: 
  md_document:
    preserve_yaml: true
---

*An important special case of graph data visualization*

1.  Formally, trees are a special type of graph which have no cycles
    (paths starting at one node that can return without retracing any
    steps). Informally, they can be thought of as hierarchies descending
    from a “root” node. These notes review some techniques for
    visualizing tree structured data.

2.  We can adapt the vertical or radial position can further encode the
    depth of a node in the tree. The data below represent the directory
    structure from a widely used web package called flare.

3.  In ggraph, this kind of visualization is constructed using the same
    type of node-link geoms as before. We can organize nodes by depth
    (distance from the root) by specifying that the layout be `tree`.

            G_flare <- tbl_graph(flare$vertices, flare$edges)
            p1 <- ggraph(G_flare, 'tree') + 
              geom_edge_link() +
              geom_node_label(aes(label = shortName), size = 3)

            p2 <- ggraph(G_flare, 'tree', circular = TRUE) + 
              geom_edge_link() +
              geom_node_label(aes(label = shortName), size = 3)

4.  In D3, it’s possible to convert entries in a tree-structured
    javascript object to tree-structured pixel coordinates using the
    `d3.tree` layout function. For example, to reconstruct the flare
    graph from above, we can use the code below,

    In the first step, we create a layout function. `d3.tree()` can be
    thought of similarly to `d3.line()` — it is a kind of functional,
    whose output is a function that takes data and returns pixel
    coordinates. The second step applies this function to the root node
    of the original data, and this is what is ultimately used to draw
    the nodes (circles) and links (paths) on the SVG.

5.  Alternatively, trees can also be visualized using enclosure (i.e.,
    the containment of some visual marks within others) to encode those
    relationships.

6.  Enclosure is used in treemaps. In this visualization, each node is
    allocated an area, and all its children are drawn within that area
    (and so on, recursively, down to the leaves).

            ggraph(graph, "treemap", weight = size) +
              geom_node_tile(aes(fill = depth, size = depth), size = 0.25) +
              scale_fill_distiller(direction = 1) +
              coord_fixed()

7.  This is a particularly useful visualization when it’s important to
    visualize a continuous attribute associated with each node. In the
    above example, the size of each tile was was determined by the
    `size` variable. For example, a large node might correspond to a
    large part of a budget or a large directory in a filesystem.

8.  The main difficulty with using enclosure is that it becomes more
    difficult to trace the parent-child structure of the tree.
    Connections between nodes immediately stand out in the node-link
    diagram, but they require deliberate inspection when using treemaps.

9.  In D3, the analogous code is generated using the `d3.treemap`
    function. Though the layout is quite different, the way in which it
    is applied to data is very similar to the use of `d3.tree`.

10. An intermediate between the node-link and the treemap approach is to
    use an icicle plot. In this approach, the distance from the root is
    still encoded using position, like in a node-link diagram. A
    continuous value can be associated with each descendant node and
    encoded encoded using the length of the associated rectangle.

11. In ggraph, we can create this using the `geom_node_tile` layer.

12. In D3, we can specify the tile centers using `d3.heirarchy` and
    widths using `d3.partition`.
