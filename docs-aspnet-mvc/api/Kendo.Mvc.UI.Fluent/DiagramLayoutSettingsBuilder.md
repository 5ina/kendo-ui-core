---
title: DiagramLayoutSettingsBuilder
---

# Kendo.Mvc.UI.Fluent.DiagramLayoutSettingsBuilder
Defines the fluent API for configuring the DiagramLayoutSettings settings.




## Methods


### EndRadialAngle(System.Double)
Defines where the circle/arc ends. The positive direction is clockwise and the angle is in degrees. This setting is specific to the radial tree layout.


#### Parameters

##### value `System.Double`
The value that configures the endradialangle.





### Grid(System.Action\<Kendo.Mvc.UI.Fluent.DiagramLayoutGridSettingsBuilder\<T,T\>\>)
Each layout algorithm has a different set of parameters customizing the layout but they also all have a common collection of parameters which relate to the way 'pieces' of a diagram are organized.
            A diagram can have in general disconnected pieces, known as components, which can be organized in a way independent of the way a component on its own is arranged. In the picture above, this is one diagram consisting of four components.When you apply a certain layout an analysis will first split the diagram in components, arrange each component individually and thereafter organize the components in a grid. The common parameters referred above deal with this grid layout, they define the width, margin and padding of the (invisible) grid used to organize the components.


#### Parameters

##### configurator System.Action<[Kendo.Mvc.UI.Fluent.DiagramLayoutGridSettingsBuilder](/api/aspnet-mvc/Kendo.Mvc.UI.Fluent/DiagramLayoutGridSettingsBuilder)<T,T>>
The action that configures the grid.





### HorizontalSeparation(System.Double)
Either the distance between the siblings if the tree is up/down or between levels if the tree is left/right. In tipOver tree layout this setting is used only for the direct children of the root


#### Parameters

##### value `System.Double`
The value that configures the horizontalseparation.





### Iterations(System.Double)
The number of times that all the forces in the diagram are being calculated and balanced. The default is set at 300, which should be enough for diagrams up to a hundred nodes. By increasing this parameter you increase the correctness of the simulation but it does not always lead to a more stable topology. In some situations a diagram simply does not have a stable minimum energy state and oscillates (globally or locally) between the minima. In such a situation increasing the iterations will not result in a better topology.In situations where there is enough symmetry in the diagram the increased number of iterations does lead to a better layout. In the example below the 100 iterations was not enough to bring the grid to a stable state while 300 iterations did bring all the nodes in such a position that the (virtual) energy of the diagram is a minimum.This setting is specific to the force-directed layout


#### Parameters

##### value `System.Double`
The value that configures the iterations.





### LayerSeparation(System.Double)
The height (in a vertical layout) or width (in a horizontal layout) between the layers.


#### Parameters

##### value `System.Double`
The value that configures the layerseparation.





### NodeDistance(System.Double)
In the force-directed layout this setting defines the optimal length between 2 nodes, which directly correlates to the state of the link between them. If a link is longer than there will be a force pulling the nodes together, if the link is shorter the force will push the nodes apart. The optimal length is more and indication in the algorithm than a guarantee that all nodes will be at this distance. The result of the layout is really a combination of the incidence structure of the diagram, the initial topology (positions of the nodes) and the number of iterations.In the layered layout it defines the minimum distance between nodes on the same level. Due to the nature of the algorithm this distance will only be respected if the the whole crossing of links and optimimzation does not induce a shift of the siblings.This setting is specific to the force-directed layout and layered layout


#### Parameters

##### value `System.Double`
The value that configures the nodedistance.





### RadialFirstLevelSeparation(System.Double)
Controls the distance between the root and the immediate children of the root. This setting is specific to the radial tree layout.


#### Parameters

##### value `System.Double`
The value that configures the radialfirstlevelseparation.





### RadialSeparation(System.Double)
Defines the radial separation between the levels (except the first one which is defined by the aforementioned radialFirstLevelSeparation). This setting is specific to the radial tree layout.


#### Parameters

##### value `System.Double`
The value that configures the radialseparation.





### StartRadialAngle(System.Double)
Defines where the circle/arc starts. The positive direction is clockwise and the angle is in degrees. This setting is specific to the radial tree layout.


#### Parameters

##### value `System.Double`
The value that configures the startradialangle.





### UnderneathHorizontalOffset(System.Double)
Defines the horizontal offset from a child with respect to its parent. This setting is specific to the tipOver tree layout.


#### Parameters

##### value `System.Double`
The value that configures the underneathhorizontaloffset.





### UnderneathVerticalSeparation(System.Double)
Defines the vertical separation between siblings and sub-branches. This setting is specific to the tipOver tree layout.


#### Parameters

##### value `System.Double`
The value that configures the underneathverticalseparation.





### UnderneathVerticalTopOffset(System.Double)
Defines the vertical separation between a parent and its first child. This offsets the whole set of children with respect to its parent. This setting is specific to the tipOver tree layout.


#### Parameters

##### value `System.Double`
The value that configures the underneathverticaltopoffset.





### VerticalSeparation(System.Double)
Either the distance between levels if the tree is up/down or between siblings if the tree is left/right. This property is not used in tipOver tree layout but rather replaced with three additional ones - underneathVerticalTopOffset, underneathVerticalSeparation and underneathHorizontalOffset


#### Parameters

##### value `System.Double`
The value that configures the verticalseparation.





### Type(Kendo.Mvc.UI.DiagramLayoutType)
The layout type.


#### Parameters

##### value [Kendo.Mvc.UI.DiagramLayoutType](/api/aspnet-mvc/Kendo.Mvc.UI/DiagramLayoutType)
The value that configures the type.





### Subtype(Kendo.Mvc.UI.DiagramLayoutSubtype)
The layout subtype.


#### Parameters

##### value [Kendo.Mvc.UI.DiagramLayoutSubtype](/api/aspnet-mvc/Kendo.Mvc.UI/DiagramLayoutSubtype)
The value that configures the subtype.





### TipOverTreeStartLevel(System.Int32)
Specifies the start level when the subtype is TipOver.


#### Parameters

##### value `System.Int32`
The start level when the subtype is TipOver.






