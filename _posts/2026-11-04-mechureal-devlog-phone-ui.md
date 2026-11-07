---
title: 게임 속 휴대폰 UI 설계
date: '2026-11-04'
categories:
- Dev Journal
tags:
- development
description: 주문 확인부터 목적지 안내까지, 배달 중에 휴대폰에 무엇을 보여주어야 할까.
lang: ko
source_mechureal: true
english_title: Designing the in-game phone UI
english_description: What the phone shows when an order comes in and when the destination
  changes.
translation_url: /en/posts/mechureal-devlog-phone-ui/
---

> [메추리알 원문 보기](https://mechureal.github.io/ko/devlog/phone-ui/)


게임 속 휴대폰은 주문을 확인하고 목적지를 찾는 데 쓴다. 새 주문이 들어오면 픽업 장소와 목적지를 보여 주고, 수락한 뒤에는 지금 찾아갈 곳을 먼저 표시한다. 음식을 받으면 안내가 가게에서 배달지로 바뀐다.

구현에서는 주문 상태와 화면 전환을 나눠 다룰 계획이다. 휴대폰을 닫았다가 열어도 주문은 그대로 진행되고, 다시 열면 현재 단계에 맞는 화면이 나온다. 이동 중 잠깐 확인하는 화면인 만큼 목적지와 주문번호를 빠르게 읽을 수 있는지부터 살핀다.
