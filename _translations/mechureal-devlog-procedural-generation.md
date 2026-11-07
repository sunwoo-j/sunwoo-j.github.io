---
title: Generating a delivery neighborhood from map data
date: '2026-11-04'
categories:
- Dev Journal
tags:
- development
description: Rules for turning roads and building footprints into a neighborhood you
  can deliver in.
lang: en
layout: lily-post
original_url: /posts/mechureal-devlog-procedural-generation/
permalink: /en/posts/mechureal-devlog-procedural-generation/
source_mechureal: true
---

> [Read the original on Mechureal](https://mechureal.github.io/en/devlog/procedural-generation/)


Roads and building footprints are a starting point. Procedural generation gives roads width and turns footprints into three-dimensional buildings. The plan is to use defaults for details the map may leave out, such as floor counts.

A building can look fine and still be unreachable. Pickup and drop-off candidates should sit on connected parts of the road network. The first pass will use a small area to find disconnected roads and unreachable destinations, then rerun the same inputs as the generation rules improve.
