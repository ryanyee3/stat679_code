---
title: Spatial Data in D3
layout: post
output:
  md_document:
    preserve_yaml: true
---

*Manipulating spatial data in D3*

1.  These notes summarize methods for static visualization of geospatial
    data in D3. Before we can make any plots, we need to be able to read
    in data. To read in vector data, it’s most convenient to store the
    data as geojson and read it in using `d3.geojson()`. The javascript
    object created by this function includes a `features` array. Element
    `i` in this array gives properties of feature `i` in the vector
    dataset.

2.  For example, we can use this to read in and visualize the glaciers
    data.

        d3.json("https://raw.githubusercontent.com/krisrs1128/stat679_code/main/examples/week7/week7-3/glaciers.geojson")
          .then(visualize) // we define the visualize function

    which shows an object like this in the console,

<img src="https://github.com/krisrs1128/stat679_code/raw/main/examples/week8/week8-3/glaciers-screenshot.png" width=600/>

1.  Even though these look like basic javascript objects, `d3.geojson`
    is actually keeping track geographic metadata behind the scenes.
    This allows us to do some basic geographic queries directly from
    javascript. For example, if we want to query the geographic
    centroid, bounds, or areas (in steradians) of each feature, we can
    use the calls below,

        let centroids = data.features.map(d3.geoCentroid),
          bounds = data.features.map(d3.geoBounds),
          areas = data.features.map(d3.geoArea);

        console.log(centroids, bounds, areas)

    You can view the console output at [this
    link](https://krisrs1128.github.io/stat679_code/examples/week8/week8-3/glaciers-query.html).
    A [similar
    query](https://github.com/krisrs1128/stat679_code/blob/main/examples/week8/week8-3/road-properties.js)
    for the Brasilia roads dataset prints output [like
    this](https://krisrs1128.github.io/stat679_code/examples/week8/week8-3/road-properties.html).
    A variety of related processing functions can be found in the
    [`d3-geo` library](https://github.com/d3/d3-geo).

2.  How can we display these data? We need a way of translating the
    abstract data into SVGs on the screen. For vector data, we can use
    D3’s `geoPath` generators. These work like line generators — they
    are initialized with visual encoding functions and can then be
    applied to any new collection of vector features.

3.  For example, we can use a path generator to draw the glacier
    boundaries,

<iframe src="https://krisrs1128.github.io/stat679_code/examples/week8/week8-3/glaciers.html" width="700" height="900">
</iframe>

1.  Remember that we have the vector feature attributes stored in
    `.features`. This allows us to modify the SVG attributes to reflect
    the data. For example, we can shade the glaciers in by their depth.

2.  We haven’t considered raster data in this lecture. This is because
    javascript doesn’t have a simple built-in way to handle raster data.
    If we want to visualize a raster dataset, we need to first convert
    them to simple PNG images. This loses the geographic metadata, and
    so any geographic processing has to be done before this step. In
    practice, it’s common to either manually convert to a PNG or to use
    a tiling library, which automatically converts raster data into a
    collection of PNGs. Both of these techniques are beyond the scope of
    our class, but if you are curious, you can check out these resources
    \[[1](https://datawanderings.com/2020/08/08/raster-backgrounds/),
    [2](https://developmentseed.org/titiler/),
    [3](https://cran.r-project.org/web/packages/tiler/vignettes/tiler-intro.html)\].
