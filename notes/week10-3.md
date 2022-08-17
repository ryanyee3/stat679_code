---
title: Graph Interactivity II
layout: post
output: 
  md_document:
    preserve_yaml: true
---

*Encoding and data interaction in graphs*

1.  These notes continue our tour of graph interactivity. We’ll explore
    how certain graph queries can be more easily answered by allowing
    users to modify visual encodings (Encoding Interactivity) and the
    form of the data that are displayed (Data Interactivity).

2.  Let’s begin with encoding interactivity. One simple example of this
    type of interactivity is highlighting. This changes the visual
    appearance of different nodes or edges based on user interest. For
    example, in either node link or adjacency matrix views, we can
    highlight one-step neighborhoods based on the position of the user’s
    mouse. For example, here is an example for node-link views,

    and here is one for adjacency matrix views,

3.  Conceptually, there is nothing unique about this interactivity code,
    compared to what we already have used for more basic plots (e.g.,
    for scatterplots), and many of the techniques we learned earlier
    apply here. For example, if want to allow the user to select a node
    without placing their mouse directly over it, we could use a voronoi
    overlay
    <https://bl.ocks.org/alexmacy/15962e97f7a9ebacd55710bf277593d4>.

4.  Brushing and linking is often used for encoding interactivity.
    Properly coordinated views can be used to highlight nodes or edges
    with a particular property. For example, suppose we wanted to a
    simple way of highlighting all the hubs in a network (i.e., nodes
    with many neighbors). One idea is to link a histogram of node
    degrees with the actual node-link diagram.

5.  In principle, we could modify a variety of node and edge attributes
    based on user interactions (size, color, line type, …). However,
    it’s usually

6.  Next, let’s consider data interactions. Two common types of data
    interactions are user-guided filtering and aggregation. In
    filtering, we remove data from view — this can be determined by UI
    inputs, dynamic queries, or direct manipulation of marks on the
    screen.

7.  For example, in the example below, we filter edges based on their
    edge-betweeness-centrality (a measure of how many paths go through
    that edge). This is helpful for isolating the “backbone” of the
    network.

8.  To implement this view, we use the standard enter-update-exit
    pattern. We had precomputed the edge centralities in advance, so
    updating the displayed marks is simply a matter of determining which
    edge array elements to bind.

9.  Pruning reduces the number of marks on the display by removing some.
    In contrast, aggregation reduces the number of marks by collapsing
    many into a few. One approach to aggregation is to clump tightly
    connected clusters of nodes into metanodes. This is a special case
    of “semantic zooming” — instead of simply resizing a static
    collection of elements, semantic zooming modifies the elements that
    are shown so that additional details are shown on demand.

10. For example, a semantic zoom with two zoom levels would allow the
    user to collapse and expand metanodes based on user interest. We
    implement a version of this below, based on the compound graph
    visualization from our earlier notes.

11. Both filtering and aggregation work by refocusing our attention on
    graph structures, either from the top down (removing less
    interesting elements) or from the bottom up (combining similar
    ones). An intermediate strategy is based on graph navigation.

12. The main idea of graph navigation is to start zoomed in, with only a
    small part of the graph visible. Then, based on user interest, we
    can visually signal those directions of the graph that are
    especially worth moving towards.

13. Concretely, we can define a degree-of-interest function across the
    collection of nodes. This function can update based on user inputs.
    The encoding of the graph can then be modified to suggest that
    certain regions be focused in on.

14. Note that this is different from the overview-plus-detail principle
    that we have used in many places. It is helpful when attempting to
    overview the entire network may not be necessary and exploring local
    neighborhoods is enough to answer most questions.

15. Together, view, encoding, and data interaction provide a rich set of
    techniques for exploring graph data. Moreover, many of the
    techniques we described here are still areas of active research, and
    perhaps in the future, it will be easier to design and implement
    graph interactions suited to specific problems of interest.
