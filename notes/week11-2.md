---
title: Principal Components Analysis
layout: post
output: 
  md_document:
    preserve_yaml: true
---

*Linear dimensionality reduction with PCA*

1.  For low-dimensional data, we could visually encode all the features
    in our data directly, either using properties of marks or through
    faceting. In high-dimensional data, this is no longer possible.
    However, though there are many features associated with each
    observation, it may still be possible to organize samples across a
    smaller number of meaningful, derived features. In the next week,
    we’ll explore a few ways of partially automating the search for
    relevant features.

2.  An important special case for dimensionality reduction emerges when
    we make the following assumptions about the set of derived features,

         * Features that are linear combinations of the raw input columns.
         * Features that are orthogonal to one another.
         * Features that have high variance.

3.  Why would we want features to have these properties?

         * Restricting to linear combinations allows for an analytical solution. We
         will relax this requirement when discussing UMAP.
         * Orthogonality means that the derived features will be uncorrelated with one
         another. This is a nice property, because it would be wasteful if features
         were redundant.
         * High variance is desirable because it means we preserve more of the
         essential structure of the underlying data. For example, if you look at this
         2D representation of a 3D object, it’s hard to tell what it is,

         (img)

         But when viewing an alternative reduction which has higher variance…

         (img)

4.  Principal Components Analysis (PCA) is the optimal dimensionality
    reduction under these three restrictions, in the sense that it finds
    derived features with the highest variance. Formally, PCA finds a
    matrix Φ∈ℝD×K and a set of vector zi∈ℝK such that xi≈Φzi for all i.
    The columns of Φ are called principal components, and they specify
    the structure of the derived linear features. The vector zi is
    called the score of xi with respect to these components. The top
    component explains the most variance, the second captures the next
    most, and so on. Geometrically, the columns of Φ span a plane that
    approximates the data. The zi provide coordinates of points
    projected onto this plane.

5.  In R, PCA can be conveniently implemented using the tidymodels
    package. The dataset below contains properties of a variety of
    cocktails, from the Boston Bartender’s guide. The first two columns
    are qualitative descriptors, while the rest give numerical
    ingredient information.

6.  The `pca_rec` object below defines a tidymodels recipe for
    performing PCA. Computation of the lower-dimensional representation
    is deferred until prep() is called. This delineation between
    workflow definition and execution helps clarify the overall
    workflow, and it is typical of the tidymodels package.

7.  We can tidy each element of the workflow object. Since PCA was the
    second step in the workflow, the PCA components can be obtained by
    calling tidy with the argument “2.” The scores of each sample with
    respect to these components can be extracted using juice. The amount
    of variance explained by each dimension is also given by tidy, but
    with the argument type = “variance”.

8.  We can interpret components by looking at the linear coefficients of
    the variables used to define them. From the plot below, we see that
    the first PC mostly captures variation related to whether the drink
    is made with powdered sugar or simple syrup. Drinks with high values
    of PC1 are usually to be made from simple syrup, those with low
    values of PC1 are usually made from powdered sugar. From the two
    largest bars in PC2, we can see that it highlights the vermouth
    vs. non-vermouth distinction.

9.  It is often easier read the components when the bars are sorted
    according to their magnitude. The usual ggplot approach to
    reordering axes labels, using either reorder() or releveling the
    associated factor, will reorder all the facets in the same way. If
    we want to reorder each facet on its own, we can use the
    `reorder_within` function coupled with `scale_*_reordered`, both
    from the tidytext package.

10. Next, we can visualize the scores of each sample with respect to
    these components. The plot below shows (zi1,zi2). Suppose that the
    columns of Φ are φ1,…,φK. Then, since xi≈φ1zi1+φ2zi2, the samples
    have large values for variables with large component values in the
    coordinate directions where zi is farther along.

11. We conclude with some characteristics of PCA, which can guide the
    choice between alternative dimensionality reduction methods.

         * Global structure: Since PCA is looking for high-variance overall, it tends
         to focus on global structure.
         * Linear: PCA can only consider linear combinations of the original features.
         If we expect nonlinear features to be more meaningful, then another approach
         should be considered.
         * Interpretable features: The PCA components exactly specify how to construct
         each of the derived features.
         * Fast: Compared to most dimensionality reduction methods, PCA is quite fast.
         Further, it is easy to implement approximate versions of PCA that scale to
         very large datasets.
         * Deterministic: Some embedding algorithms perform an optimization process,
         which means there might be some variation in the results due to randomness in
         the optimization. In contrast, PCA is deterministic, with the components being
         unique up to sign (i.e., you could reflect the components across an axis, but
         that is the most the results might change).
