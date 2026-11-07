---
title: Bringing OpenStreetMap data into Unity
date: '2026-11-04'
categories:
- Dev Journal
tags:
- development
- map
- osm
description: An introduction to OSM and the steps that turn real neighborhood map
  data into roads and buildings in Unity.
lang: en
layout: lily-post
original_url: /posts/mechureal-devlog-osm-to-unity/
permalink: /en/posts/mechureal-devlog-osm-to-unity/
source_mechureal: true
---

> [Read the original on Mechureal](https://mechureal.github.io/en/devlog/osm-to-unity/)


Imagine building an open-world map from scratch. Someone has to decide where the roads go, where they meet, and how closely the buildings sit together. Even a small neighborhood or a single alley involves plenty of decisions. What if the layout of a real neighborhood could provide a starting point?

This post introduces OpenStreetMap and the process of bringing its data into Unity, following real streets as they become roads in the game.

## What is OSM?

**OpenStreetMap**, or **OSM**, is a project in which people work together to create and update map data. Contributors record roads, buildings, shops, and other places, and the resulting data can be used and shared under an open license. The map displayed on OSM uses that data to draw roads, buildings, and other features. The [OpenStreetMap introduction](https://www.openstreetmap.org/about/main) explains the project and how people contribute.

For game development, the underlying information is useful. It describes where roads run, how they bend, and which areas buildings occupy. Using those layouts reduces the amount of work needed to draw a city's basic arrangement by hand.

Importing OSM does not deliver a finished 3D city. Building exteriors, interiors, and the road surfaces beneath the player still need to be made. OSM provides a neighborhood's basic structure as a starting point.

<figure>
  <img src="https://mechureal.github.io/images/devlog/osm-to-unity/osm-neighborhood.png" alt="OpenStreetMap showing roads and buildings around Suwon City Hall" />
  <figcaption>An OSM map of the area around Suwon City Hall. © <a href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>.</figcaption>
</figure>

## A map made of points and lines

OSM has three basic elements: **nodes**, which mark points; **ways**, which connect points in order; and **relations**, which describe relationships between elements. Connected points can trace a road, while a closed outline can describe a building's footprint. Relations can group outlines into more complex areas.

**Tags** explain what those shapes mean. For example, `building=yes` identifies a building, while `highway=residential` identifies a residential road. A line's tags help us interpret its purpose. The [OSM elements documentation](https://wiki.openstreetmap.org/wiki/Elements) explains this structure.

Here we will focus on road connections and building footprints, which provide the basic layout of the city.

<!-- IMAGE PLAN: After the final paragraph of ‘A map made of points and lines’.
File: public/images/devlog/osm-to-unity/osm-points-and-outlines.png
Scene: Concept diagram highlighting points, connecting lines, and a closed building outline at a small junction.
Alt: A concept diagram showing a road as connected points and a building footprint as a closed outline.
Caption: Connected points trace roads; closed outlines describe the space occupied by buildings.
Preparation guide: docs/devlog/osm-to-unity-images.md
-->

<figure class="optional-image">
  <img src="https://mechureal.github.io/images/devlog/osm-to-unity/osm-points-and-outlines.png" alt="A concept diagram showing a road as connected points and a building footprint as a closed outline" />
  <figcaption>A conceptual diagram of roads and building footprints as points and lines.</figcaption>
</figure>

## Turning a location on Earth into a position in a game

OSM records locations using latitude and longitude. Unity places objects using distances along axes, such as how far right or forward something sits from an origin.

We therefore need a reference location for the selected area and a conversion from geographic coordinates to distances from that reference. This project uses the X axis for east and west, the Z axis for north and south, and meters for distance. The Y axis represents height.

For example, a point 100 meters east and 50 meters north of the origin can be written as `(100, 0, 50)` if its height is assumed to be zero. This requires more than copying latitude and longitude into Unity. The distance represented by a degree of longitude changes with latitude, so applying one identical multiplier to both coordinates is insufficient.

<!-- IMAGE PLAN: After the third paragraph of ‘Turning a location on Earth into a position in a game’ (the 100-meter/50-meter example), before ‘The current Unity code…’.
File: public/images/devlog/osm-to-unity/local-coordinate-example.png
Scene: Concept diagram marking the origin, east +X, north +Z, and the point (100, 0, 50), with height fixed at zero.
Alt: A concept diagram placing a point 100 meters east and 50 meters north at Unity coordinates (100, 0, 50).
Caption: Distances in meters from a reference point become positions in the game.
Preparation guide: docs/devlog/osm-to-unity-images.md
-->

<figure class="optional-image">
  <img src="https://mechureal.github.io/images/devlog/osm-to-unity/local-coordinate-example.png" alt="A concept diagram placing a point 100 meters east and 50 meters north at Unity coordinates (100, 0, 50)" />
  <figcaption>A conceptual example of distances from an origin expressed as game coordinates.</figcaption>
</figure>

The current Unity code receives map data that has already been converted to distances. When importing it into an editable map asset, it also adjusts positions using the center of the map bounds. This keeps track of the geographic reference while placing the map around a convenient game-space origin.

## Passing the information through JSON

The project reads a JSON file containing road connection points, road segments, building footprints, and related information. JSON is a text format that stores named values. Here, it serves as a package for delivering map information to Unity.

This is a project-specific format rather than an untouched copy of the complete OSM source. It separates road endpoints, points along each road's shape, and building outlines into structures the game can read. Original identifiers and tags are kept alongside them.

Unity loads the file and imports it into editable game map data. Keeping the underlying data separate from its visible representation lets us inspect the connection points referenced by roads and the validity of building outlines.

## Turning lines into roads and outlines into buildings

A road drawn as a line does not yet provide a surface for a motorcycle. We need to build a surface with width along that line. A building footprint similarly needs walls and a roof to become a solid-looking structure. In Unity, the vertices and triangles that describe these surfaces form a **mesh**.

The project currently has code for generating road surfaces and building volumes from these shapes. During building import, it uses height information when available. If only a floor count is present, it applies a height per floor. If neither is available, it uses a fallback based on the building type and settings.

A fallback height is an assumption for the game, not a measurement of the real building. That distinction matters: imported facts and generated details should remain distinguishable. Facade materials and window placement also require separate rules because a footprint alone cannot describe them.

<!-- IMAGE PLAN: After the final paragraph of ‘Giving roads width and buildings height’.
File: public/images/devlog/osm-to-unity/unity-outlines-and-meshes.png
Scene: Same actual project area and viewpoint, comparing road lines/building outlines with generated road surfaces/building volumes. Do not present an unimplemented result as a real capture.
Alt: Side-by-side Unity views of building outlines and the buildings generated from them.
Caption: Adding width and height turns lines and outlines into road surfaces and building forms.
Preparation guide: docs/devlog/osm-to-unity-images.md
-->

<figure class="optional-image">
  <img src="https://mechureal.github.io/images/devlog/osm-to-unity/unity-outlines-and-meshes.png" alt="Side-by-side Unity views of building outlines and the buildings generated from them" />
  <figcaption>Building outlines and the buildings generated from them.</figcaption>
</figure>

## A mapped road still needs to be drivable

Once the roads and buildings are in place, we need to check whether the player can actually move between them. Road connections come first. A road on a bridge and the street beneath it may overlap on the map, but they must not be connected as a junction. Conversely, if a connection between roads is lost during conversion, route calculations may fail to find a way to the destination.

Even with the correct connections, the generated road surfaces can still have problems. There may be gaps at junctions, buildings blocking the street, or height differences between roads and terrain. Collision handling also needs checking so that the player does not fall through the road or pass through walls.

To make these adjustments possible, the project lets us edit imported roads and buildings as game map data. Road shapes and widths can be changed, and those edits are preserved when source attributes are imported again.

Next, we plan to ride through the map and test delivery routes. We will check whether the player can travel from a restaurant to the delivery address, reach the building from the road, and fit through narrow alleys, then adjust the map where needed.
