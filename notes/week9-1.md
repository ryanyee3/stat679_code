---
title: Introduction to Networks and Trees
layout: post
output: 
  md_document:
    preserve_yaml: true
---

**Typical tasks and example network datasets**

    library(tidyverse)
    library(ggraph)
    library(tidygraph)
    theme_set(theme_graph())

1.  Networks and trees can be used to represent information in a variety
    of contexts. Abstractly, networks and trees are types of *graphs*,
    which are defined by (a) a set *V* of vertices and (b) a set *E* of
    edges between pairs of vertices.

2.  It is helpful to have a few specific examples in mind,

    -   The Internet: *V* = {All Webpages}, (*v*,*v*<sup>′</sup>) ∈ *E*
        if there is a hyperlink between pages *v* and *v*<sup>′</sup>.
    -   Evolutionary Tree:
        *V* = {All past and present species}, (*v*,*v*<sup>′</sup>) ∈ *E*
        if one of the species *v* or *v*<sup>′</sup> is a descendant of
        the other.
    -   Disease Transmission:
        *V* = {Community Members}, (*v*,*v*<sup>′</sup>) ∈ *E* if the
        two community members have come in close contact.
    -   Directory Tree:
        *V* = {All directories in a computer}, (*v*,*v*<sup>′</sup>) ∈ *E*
        if one directory is contained in the other.

    <figure>

    <img src="https://uwmadison.box.com/shared/static/cjk3i7mephlyguka9y5h1d40uy9rhdk2.png"
            alt="The Opte project.">

    <figcaption>

    A visualization of the internet, from the
    <a href="https://opte.org">Opte Project</a>.

    </figcaption>
    </figure>
    <figure>

    <img src="https://itol.embl.de/img/home/box2.png"
            alt="The Opte project.">

    <figcaption>

    An evolutionary tree, from the
    <a href="https://itol.embl.de/">Interactive Tree of Life”&gt;</a>

    </figcaption>
    </figure>
    <figure>

    <img src="https://uwmadison.box.com/shared/static/wlnq401dxdd9pwdtg0ewgnhx7w9nzwbp.png"
          alt="COVID-19 transmission network.">

    <figcaption>

    A COVID-19 transmission network, from “Clustering and superspreading
    potential of SARS-CoV-2 infections in Hong Kong.”

    </figcaption>
    </figure>
    <figure>

    <img src="https://uwmadison.box.com/shared/static/erbi39htkgzndhxh8yhvcoq3imfkxdca.png"
          alt="Directories in a file system can be organized into a tree, with parent and child directories.">

    <figcaption>

    Directories in a file system can be organized into a tree, with
    parent and child directories.

    </figcaption>
    </figure>

3.  Either vertices or edges might have attributes. For example, in the
    directory tree, we might know the sizes of the files (vertex
    attribute), and in the disease transmission network we might know
    the duration of contact between individuals (edge attribute).

4.  An edge may be either undirected or directed. In a directed edge,
    one vertex leads to the other, while in an undirected edge, there is
    no sense of ordering.

5.  In R, the `tidygraph` package can be used to manipulate graph data.
    It’s `tbl_graph` class stores node and edge attributes in a single
    data structure. and `ggraph` extends the usual ggplot2 syntax to
    graphs.

        E <- data.frame(
          source = c(1, 2, 3, 4, 5),
          target = c(3, 3, 4, 5, 6)
        )
        G <- tbl_graph(edges = E)
        G

        ## # A tbl_graph: 6 nodes and 5 edges
        ## #
        ## # A rooted tree
        ## #
        ## # Node Data: 6 × 0 (active)
        ## #
        ## # Edge Data: 5 × 2
        ##    from    to
        ##   <int> <int>
        ## 1     1     3
        ## 2     2     3
        ## 3     3     4
        ## # … with 2 more rows

    This `tbl_graph` can be plotted using the code below. There are
    different geoms available for nodes and edges – for example, what
    happens if you replace `geom_edge_link()` with `geom_edge_arc()`?

        ggraph(G, layout = 'kk') + 
          geom_edge_link() +
          geom_node_point()

    ![](/stat679_notes/assets/week9-1/unnamed-chunk-4-1.png)

6.  We can mutate node and edge attributes using dplyr-like syntax. We
    have to distinguish node and edge mutations using `%N>%` and `%E>%`,
    respectively.

        G <- G %>%
          mutate(
            id = row_number(),
            group = id < 4
          ) %E>%
          mutate(width = runif(n()))
        G

        ## # A tbl_graph: 6 nodes and 5 edges
        ## #
        ## # A rooted tree
        ## #
        ## # Edge Data: 5 × 3 (active)
        ##    from    to width
        ##   <int> <int> <dbl>
        ## 1     1     3 0.164
        ## 2     2     3 0.822
        ## 3     3     4 0.457
        ## 4     4     5 0.922
        ## 5     5     6 0.141
        ## #
        ## # Node Data: 6 × 2
        ##      id group
        ##   <int> <lgl>
        ## 1     1 TRUE 
        ## 2     2 TRUE 
        ## 3     3 TRUE 
        ## # … with 3 more rows

    Now we can visualize these derived attributes using an aesthetic
    mapping within the `geom_edge_link` and `geom_node_point` geoms.

        ggraph(G, layout = "kk") +
          geom_edge_link(aes(width = width)) +
          geom_node_label(aes(label = id))

    ![The same network as above, but with edge size encoding the weight
    attribute.](/stat679_notes/assets/week9-1/unnamed-chunk-6-1.png)

### Example Tasks

1.  What types of data that are amenable to representation by networks
    or trees? What visual comparisons do networks and trees facilitate?

2.  Our initial examples suggest that trees and networks can be used to
    represent either physical interactions or conceptual relationships.
    Typical tasks include,

    -   Searching for groupings
    -   Following paths
    -   Isolating key nodes

3.  By “searching for groupings,” we mean finding clusters of nodes that
    are highly interconnected, but which have few links outside the
    cluster. This kind of modular structure might lend itself to deeper
    investigation within each of the clusters.

    -   Clusters in a network of political blogs might suggest an echo
        chamber effect.
    -   Gene clusters in a differential expression study might suggest
        pathways needed for the production of an important protein.
    -   Clusters in a recipe network could be used identify different
        culinary techniques or cuisines.

    <figure>

    <img src="http://www.visualcomplexity.com/vc/images/227_big02.jpg"
            alt="COVID-19 transmission network.">

    <figcaption>

    A representation of 1200 blogs before the 2004 election, from “The
    political blogosphere and the 2004 US election: divided they blog.”

    </figcaption>
    </figure>

4.  By “following paths,” we mean tracing the paths out from a
    particular node, to see which other nodes it is close to.

    -   Following paths in a citation network might reveal the chain of
        publications that led to an important discovery.
    -   Following paths in a recommendation network might suggest other
        users who might be interested in watching a certain movie.

    <figure>

    <img src="https://psl.linqs.org/assets/images/hyper/fig3.png"
            alt="Recommendation network">

    <figcaption>

    A recommendation network, linking individuals and the movies that
    they viewed.

    </figcaption>
    </figure>

5.  “Isolating key nodes” is a more fuzzy concept, usually referring to
    the task of finding nodes that are exceptional in some way. For
    example, it’s often interesting to find nodes with many more
    connections than others, or which link otherwise isolated clusters.

    -   A node with many edges in a disease transmission network is a
        superspreader.
    -   A node that links two clusters in a citation network might be
        especially interdisciplinary.
    -   A node with large size in a directory tree might be a good
        target for reducing disk usage.

    <figure>

    <img src="https://www.leydesdorff.net/betweenness/index_files/image008.jpg"
            alt="Recommendation network">

    <figcaption>

    The scientific journal, Social Networks, links several publication
    communities, as found by “Betweenness Centrality as an Indicator of
    the Interdisciplinarity of Scientific Journals.”

    </figcaption>
    </figure>

6.  If you find these questions interesting, you might enjoy the catalog
    of examples on the website
    [VisualComplexity](http://www.visualcomplexity.com/vc/).
