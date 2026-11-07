---
title: 현실 지도에서 동네를 절차적으로 생성하기
date: '2026-11-04'
categories:
- Dev Journal
tags:
- development
description: 도로와 건물 윤곽을 바탕으로 배달할 수 있는 동네를 만드는 규칙.
lang: ko
source_mechureal: true
english_title: Generating a delivery neighborhood from map data
english_description: Rules for turning roads and building footprints into a neighborhood
  you can deliver in.
translation_url: /en/posts/mechureal-devlog-procedural-generation/
---

> [메추리알 원문 보기](https://mechureal.github.io/ko/devlog/procedural-generation/)


지도에서 도로와 건물 윤곽을 읽어도 바로 배달할 수 있는 동네가 생기지는 않는다. 절차적 생성 단계에서는 도로에 폭을 주고 건물 윤곽을 입체로 올린다. 층수처럼 지도에 없는 정보는 기본값을 두고 처리할 계획이다.

건물이 보이는 것과 그곳까지 갈 수 있는 것은 별개의 문제다. 주문 출발지와 도착지는 도로망에서 서로 이어지는 곳을 후보로 삼는다. 먼저 작은 구역에서 끊긴 도로나 진입할 수 없는 목적지를 찾고, 문제가 생긴 입력을 다시 돌려 보며 생성 규칙을 다듬을 계획이다.
