---
title: 디스코드 봇 제작 - 0. 봇 생성과 기본 설정
date: 2024-05-21 10:45:40 +/-TTTT
lastmod: 2022-05-22 14:45:00 +/-TTTT
categories: [Python, Discord.py]
tags: [discord]
description: 디스코드 봇을 생성하고 초기 설정에 대해 다룹니다.
---

> 이 글에서 다룰 내용
> - 디스코드 봇이란 무엇인가
> - 봇을 생성하는 방법
> - 테스트용 서버에 봇 추가하기

어느샌가 [디스코드](https://discord.com/)는 나와 주변 이들의 생활 깊숙이 자리 잡았다. 친구들과 소통하는 하나의 플랫폼으로 사용하는 것이지만 메시지와 음성 채팅 기능을 제공하는 것은 비단 디스코드뿐만이 아니다. 많은 선택지들 중 디스코드를 고집하는 것은 아무래도 뛰어난 확장성 때문일 것이다. 그리고 그 확장성의 핵심에 있는 것이 바로 봇이다. 

## 디스코드 봇이란?

디스코드를 이용하면서 어느 정도 규모가 있는 서버에 들어가 봤다면 파란 딱지가 붙어있는 수상하게 생긴 녀석들을 보았을 것이다.

<img src="/assets/img/discord bot/0_0.png" alt="0_0" style="display: block; margin-left: auto; margin-right: auto; width: 60%;">
*서버에 접속해 있는 디스코드 봇들*

이 녀석들이 바로 봇으로, 이벤트나 명령어에 자동으로 응답하여 임무를 수행하는 코드 덩어리들이다.

인간 운영자를 대신해 서버를 관리하거나 음성 채널 안에서 음악을 재생하기도 하는 등, 정말 다양한 사용처가 있다. 나도 작은 서버를 운영하면서 필요에 따라 봇들을 몇 개 추가해 사용했었다. 이미 [수십만 개](https://top.gg/)가 넘는 봇들이 있지만 가끔 불편할 경우가 있다. 어떠한 특정한 기능을 넣고 싶은데 여러 개의 봇을 추가하거나 아예 원하는 기능이 없는 경우를 맞닥트렸다. 

<center><blockquote><i>"안 되면 되게 하라"</i></blockquote></center>

그래서 직접 만들기로 결심했다.

> 일반 계정으로 코드를 돌릴 수도 있지만 잘못하다가는 디스코드 계정이 [**정지**](https://support.discord.com/hc/en-us/articles/115002192352-Automated-User-Accounts-Self-Bots) 당할 수도 있다.
{: .prompt-warning }

## 봇 생성하기

봇을 제작하고 기능을 넣기 위해서는 당연하게도 먼저 봇을 만들어야 한다. 

### 1. 애플리케이션 생성하기

먼저 [디스코드 개발자 포털(Discord Developer Portal)](https://discord.com/developers/applications)에 접속해 로그인을 해준다.

![](/assets/img/discord bot/0_1.png)

완료되면 아래처럼 [**애플리케이션**(application)](https://discord.com/developers/docs/game-sdk/applications)을 생성할 수 있는 개발자 포털 홈페이지가 나온다. 애플리케이션을 생성함으로써 인증 토큰을 제공받고 권한을 설정하는 등 디스코드 API와 상호작용할 수 있게 된다.

![](/assets/img/discord bot/0_2.png)

우측 상단의 <kbd>New Application</kbd>을 눌러 새로운 애플리케이션을 생성하자.

![](/assets/img/discord bot/0_3.png)

다음으로, 열린 창에 원하는 애플리케이션 이름을 설정하고 <kbd>Create</kbd>를 누른다.

![](/assets/img/discord bot/0_4.png)

이제 생성된 애플리케이션에 대한 정보가 화면에 뜬다. 여기서 아이콘, 이름과 설명 등을 수정할 수 있지만 봇을 사용하는 유저에게 직접적으로 보이지는 않는다.

> 봇 외에도 디스코드 API와 상호작용하는 모든 프로그램은 디스코드 애플리케이션이 필요하다.
{: .prompt-info }

하지만 우리는 봇을 만들 것이기 때문에 좌측 메뉴에서 <kbd>Bot</kbd> 탭을 눌러 이동해주자.

![](/assets/img/discord bot/0_5.png)

2024년 5월 기준으로는 봇을 따로 생성하지 않았어도 이미 봇이 생성되어 있다. 혹시나 아무것도 없다면 <kbd>Add Bot</kbd>을 눌러 생성해주면 된다. 

기본적으로 봇은 애플리케이션의 이름을 받아온다. 사람들에게 보여지는 봇 이름을 바꾸고 싶다면 USERNAME 칸을 수정하면 된다. 태그 숫자는 아쉽게도 바꾸는 방법이 없다. ~~원하는 태그가 나올 때까지 재생성하는 수밖에...~~

드디어 봇을 생성했지만 아직 써먹을 공간이 없다. 이제 길드를 만들어 사용자와 같은 공간에 넣어보자.

### 2. 테스트용 길드(서버) 생성하기

디스코드 API를 사용해 본 적이 없다면 **길드(guild)**라는 용어가 생소할 것이다. 사실 우리가 흔히 디스코드에서 지칭하는 서버가 바로 길드이다. 개발을 하는 입장에서 디스코드의 서비스를 담당하는 본 서버와 구분 지어 말하기 위해 별도의 용어를 두는 것이다. 앞으로 나올 코드에서 보일 `guild`도 특정 디스코드 서버와 관련된 일을 수행하기 위해 사용된다고 보면 된다.

> 앞으로 글에서는 편리성을 위해 **길드** 대신 **서버**를 사용할 것이다.
{: .prompt-info }

이미 내가 있는 서버에 봇을 초대할 수도 있지만 관리자 권한도 필요하고 테스트하려면 메시지도 보내고 아주 시끄러울 것이기에 아래 단계를 따라 전용 서버를 새로 파는 것을 추천한다.

![](/assets/img/discord bot/0_6.png)

길드를 만들려면 디스코드 앱이나 [홈페이지](https://discord.com/channels/@me)에 들어가서 좌측 상단의 <kbd>+</kbd> 아이콘을 눌러주면 된다. 

![](/assets/img/discord bot/0_7.png) | ![](/assets/img/discord bot/0_8.png)

이후 뜨는 창에서 <kbd>직접 만들기</kbd>를 선택한 후 <kbd>나와 친구들을 위한 서버</kbd>를 다시 선택해주자.

![](/assets/img/discord bot/0_9.png)

서버 이름을 입력해주고 <kbd>만들기</kbd>를 클릭하면 생성이 완료된다. 

![](/assets/img/discord bot/0_10.png)

화면 왼쪽의 서버 목록에도 방금 만든 서버가 보인다. 봇을 넣을 공간을 만들었으니 다음은 봇을 넣을 차례다.

### 3. 길드에 봇 추가하기

봇은 일반 사용자들처럼 초대를 보내 추가할 수 없다. 대신 [**OAuth2**](https://discord.com/developers/docs/topics/oauth2) 프로토콜을 사용한 인증을 통해 추가한다.

![](/assets/img/discord bot/0_11.png)

다시 [개발자 포털](https://discord.com/developers/applications)로 돌아가서 이번에는 <kbd>OAuth2</kbd> 탭으로 이동해준다. 아래에 **OAuth2 URL Generator**가 보이는데, 여기서 우리가 생성한 애플리케이션으로 디스코드 API에 접근하는 것을 허용하는 링크를 만들어준다.

> **Scope**는 애플리케이션에 부여하는 권한의 종류이다. (`read`, `write`, `update` 등)
{: .prompt-info }

![](/assets/img/discord bot/0_12.png)

**SCOPES**에서 **bot**에 체크하면 아래에 봇의 권한을 설정하는 **BOT PERMISSIONS**가 생기는데, 여기서 원하는 것만 골라담을 수 있긴 하지만 포괄적인 개발을 위해 가장 처음에 있는 **Administrator**를 체크해준다. 

![](/assets/img/discord bot/0_14.png)

완료되면 하단에 생성된 URL을 <kbd>Copy</kbd>로 복사해준다.

![](/assets/img/discord bot/0_15.png) | ![](/assets/img/discord bot/0_16.png)

복사한 URL을 브라우저에 붙여넣어주면 봇과 연결을 할 수 있는 창이 뜬다. 드롭다운 메뉴에서 아까 생성했던 서버를 선택해주고 <kbd>계속하기</kbd>와 <kbd>승인</kbd>을 차례대로 눌러주면 성공했다는 알림과 함께 봇이 서버에 추가된다.

![](/assets/img/discord bot/0_17.png)
![](/assets/img/discord bot/0_18.png)

디스코드 서버 화면에서도 봇이 입장했다는 메시지를 확인할 수 있다. 또, 우측의 멤버 목록에서도 오프라인 상태인 봇을 볼 수 있다.

지금은 아무 기능이 없는 빈 깡통이지만 이제 무언가를 할 수 있게 만들어 볼 것이다.

## Python으로 봇 개발 시작하기



> **이 토큰을 절대 공개해서는 안 된다.**
{: .prompt-danger }

만약 **Public**으로 설정된 깃허브 repository에 토큰을 업로드해 노출시켰다면 깃허브에서도 경고 메시지가 뜨고 디스코드에서도 새로운 토큰을 발급받도록 강제할 것이다.

