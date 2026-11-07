---
title: OpenStreetMap 데이터를 Unity로 옮기기
date: '2026-11-04'
categories:
- Dev Journal
tags:
- development
- map
- osm
description: 실제 동네의 지도 데이터를 Unity 속 도로와 건물로 옮기는 과정.
lang: ko
source_mechureal: true
english_title: Bringing OpenStreetMap data into Unity
english_description: An introduction to OSM and the steps that turn real neighborhood
  map data into roads and buildings in Unity.
translation_url: /en/posts/mechureal-devlog-osm-to-unity/
---

> [메추리알 원문 보기](https://mechureal.github.io/ko/devlog/osm-to-unity/)


오픈 월드 게임의 맵을 처음부터 만든다고 생각해 보자. 길을 어디로 낼지, 교차로를 어디에 둘지, 건물을 얼마나 빽빽하게 세울지 정해야 한다. 작은 동네, 작은 골목 하나에도 결정할 것이 참으로 많다. 하지만 실제 동네의 도로와 건물 배치를 출발점으로 삼을 수 있다면 어떨까?

이번 글에서는 OpenStreetMap이 어떤 데이터인지부터 살펴보고, 그 데이터를 Unity에서 사용할 수 있는 형태로 옮기는 과정을 소개한다. 현실의 골목을 게임 속 길로 옮기는 과정을 살펴본다.

## OSM은 무엇인가

**OpenStreetMap**, 줄여서 **OSM**은 여러 사람이 함께 지도 데이터를 만들고 갱신하는 프로젝트다. 참여자들이 도로, 건물, 가게 같은 장소의 정보를 직접 기록하며, 이렇게 모인 데이터는 공개 라이선스에 따라 누구나 사용하고 공유할 수 있다. OSM에서 보는 지도는 이 데이터를 바탕으로 도로와 건물 등을 화면에 그려낸 것이다. [OpenStreetMap 소개](https://www.openstreetmap.org/about/main)에서 프로젝트의 취지와 참여 방식을 확인할 수 있다.

게임 제작에서 관심을 두는 것은 그 안에 담긴 정보다. 어느 위치에 길이 있고, 길이 어떤 모양으로 이어지며, 건물이 어느 범위를 차지하는지 읽을 수 있다. 이 정보를 가져오면 도시의 기본 배치를 처음부터 손으로 그리는 작업을 줄일 수 있다.

다만 OSM 데이터를 가져온다고 완성된 3D 도시가 주어지는 것은 아니다. 건물의 외관이나 실내, 플레이어가 밟을 도로 표면은 별도로 만들어야 한다. OSM은 그 작업을 시작할 때 참고할 동네의 뼈대에 가깝다.

<figure>
  <img src="https://mechureal.github.io/images/devlog/osm-to-unity/osm-neighborhood.png" alt="도로와 건물 배치가 표시된 수원시청 주변 OpenStreetMap 지도" />
  <figcaption>수원시청 주변 OSM 지도. © <a href="https://www.openstreetmap.org/copyright">OpenStreetMap 기여자</a>.</figcaption>
</figure>

## 지도는 점과 선으로 기록된다

OSM의 기본 요소는 점인 <strong>노드(node)</strong>, 점들을 순서대로 연결한 <strong>웨이(way)</strong>, 여러 요소의 관계를 묶는 <strong>릴레이션(relation)</strong>이다. 도로의 굽은 모양은 연결된 점들로, 건물을 위에서 내려다봤을 때의 외곽선은 닫힌 선으로 표현할 수 있다. 여러 윤곽을 묶어야 하는 복잡한 영역에는 릴레이션이 쓰이기도 한다.

모양에 의미를 붙이는 정보도 있다. <strong>태그(tag)</strong>라고 부르며, `building=yes`는 건물임을, `highway=residential`은 주거 지역의 도로임을 나타내는 식이다. 같은 선이라도 태그를 읽어야 무엇을 표현하는지 판단할 수 있다. 이 구조는 [OSM의 기본 요소 설명](https://wiki.openstreetmap.org/wiki/Elements)에 정리되어 있다.

이 글에서는 이 중에서 도로의 연결과 건물의 윤곽에 집중한다. 도시의 기본 배치를 정하는 데 필요한 정보이기 때문이다.

<figure class="optional-image">
  <img src="https://mechureal.github.io/images/devlog/osm-to-unity/osm-points-and-outlines.png" alt="점을 연결한 도로와 닫힌 선으로 표현한 건물 외곽선을 보여 주는 개념도" />
  <figcaption>점과 선으로 나타낸 도로와 건물 윤곽의 개념도.</figcaption>
</figure>

## 지구 위의 위치를 게임 속 위치로 바꾸기

OSM의 위치는 위도와 경도로 기록된다. 반면 Unity에서는 기준점에서 오른쪽으로 얼마나, 앞으로 얼마나 떨어졌는지 같은 공간상의 거리로 물체를 배치한다.

따라서 사용할 지역에 기준점을 정하고, 각 위치를 그 기준점에서 떨어진 거리로 환산하는 과정이 필요하다. 이 프로젝트에서는 동서 방향을 X축, 남북 방향을 Z축에 대응시키고, 거리는 미터 단위로 다룬다. 높이는 Y축이다.

예를 들어 기준점에서 동쪽으로 100미터, 북쪽으로 50미터 떨어진 지점은 높이를 0으로 가정하면 `(100, 0, 50)`으로 표현할 수 있다. 위도·경도의 숫자를 그대로 Unity에 넣는 것과는 다르다. 특히 경도 1도에 해당하는 거리는 위도에 따라 달라지므로 단순히 같은 숫자를 곱해서는 안 된다.

<figure class="optional-image">
  <img src="https://mechureal.github.io/images/devlog/osm-to-unity/local-coordinate-example.png" alt="원점에서 동쪽 100미터, 북쪽 50미터인 지점을 Unity 좌표 (100, 0, 50)으로 나타낸 개념도" />
  <figcaption>기준점에서 떨어진 거리를 미터 단위의 게임 좌표로 표현한 개념도.</figcaption>
</figure>

현재 Unity 쪽 코드가 입력으로 받는 것은 이 거리 변환까지 마친 지도 데이터다. 편집 가능한 지도 자산으로 옮길 때는 지도 범위의 중심을 이용해 위치를 다시 조정한다. 지리적인 기준점과 게임 안에서 다루기 편한 원점을 함께 관리하는 구조다.

## 필요한 정보를 JSON으로 전달하기

프로젝트에서는 도로의 연결점, 도로 구간, 건물 윤곽 등을 정리한 JSON 파일을 읽는다. JSON은 이름과 값을 짝지어 저장하는 텍스트 형식이다. 여기서는 지도 정보를 Unity에 전달하는 꾸러미라고 생각하면 된다.

이 파일은 OSM 원본 전체를 그대로 담은 형식과는 다르다. 프로젝트에서 읽기 편하도록 도로의 시작점과 끝점, 중간에 꺾이는 지점들, 건물의 윤곽 등을 나누어 담는다. 원본의 식별 번호와 태그도 함께 보관한다.

Unity에서는 먼저 파일을 읽고, 이를 편집 가능한 게임 지도 데이터로 옮긴다. 도로가 참조하는 연결점과 건물 윤곽이 유효한지 살필 수 있도록, 화면에 보이는 모양과 그 모양을 구성하는 데이터를 구분해 다룬다.

## 선은 도로로, 윤곽은 건물로 변환하기

지도에 있는 도로의 선만으로는 오토바이가 달릴 노면이 생기지 않는다. 선을 따라 폭을 가진 표면을 만들어야 한다. 건물도 외곽선만 있는 상태에서 벽과 지붕을 만들어 입체로 올려야 한다. Unity에서 이런 표면을 표현하는 꼭짓점과 삼각형의 묶음을 <strong>메시(mesh)</strong>라고 부른다.

현재 프로젝트에는 도로의 선을 따라 표면을 만들고, 건물 윤곽을 입체로 만드는 코드가 있다. 건물을 가져올 때는 높이 정보가 있으면 이를 사용하고, 층수만 있으면 층당 높이를 적용한다. 둘 다 없으면 건물 유형과 설정에 따른 기본 높이를 사용한다.

여기서 기본값으로 채운 높이는 실제 건물을 측정한 값이 아니다. 지도에서 가져온 정보와 게임을 위해 보충한 값을 구분해야 하는 이유다. 외벽의 재질이나 창문 배치도 윤곽만으로는 알 수 없으므로 별도의 표현 규칙이 필요하다.

<figure class="optional-image">
  <img src="https://mechureal.github.io/images/devlog/osm-to-unity/unity-outlines-and-meshes.png" alt="Unity에서 건물 외곽선과 이를 바탕으로 생성한 입체 건물을 나란히 비교한 모습" />
  <figcaption>건물 외곽선과 이를 바탕으로 생성한 입체 건물.</figcaption>
</figure>

## 지도에 길이 있다고 달릴 수 있는 건 아니다

도로와 건물을 만들었다면, 그 사이로 실제로 이동할 수 있는지 확인해야 한다. 먼저 살필 것은 도로의 연결 관계다. 예를 들어 다리 위 도로와 그 아래 도로는 지도에서 겹쳐 보여도 교차로처럼 연결해서는 안 된다. 반대로 실제로 이어지는 도로가 변환 과정에서 끊어지면, 경로를 계산할 때 목적지까지 가는 길을 찾지 못할 수 있다.

연결 관계가 맞더라도 생성된 도로 표면에는 문제가 남을 수 있다. 교차로에 틈이 생기거나, 건물이 도로를 가로막거나, 도로와 지형 사이에 높이 차가 생기는 경우다. 플레이어가 노면 아래로 빠지거나 벽을 통과하지 않도록 충돌 처리도 함께 확인해야 한다.

이런 부분을 조정할 수 있도록, 현재 프로젝트에서는 가져온 도로와 건물을 게임용 지도 데이터로 편집할 수 있다. 도로의 모양과 폭을 수정할 수 있으며, 원본 속성을 다시 가져올 때도 기존에 편집한 도로의 형태와 폭을 유지하도록 구성되어 있다.

앞으로는 이 지도를 직접 달려 보며 배달 동선을 점검할 계획이다. 가게에서 배달지까지 이동할 수 있는지, 도로에서 건물까지 접근할 수 있는지, 좁은 골목을 지나기에 충분한 공간이 있는지 확인하고 필요한 부분을 다듬어 나가려 한다.
