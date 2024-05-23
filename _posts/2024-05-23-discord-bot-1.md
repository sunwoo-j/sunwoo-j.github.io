---
title: 디스코드 봇 제작 - 1. 디스코드 봇 생성
date: 2024-05-22 09:31:20 +/-TTTT
lastmod: 2022-05-23 14:31:20 +/-TTTT
categories: [Python, Discord.py]
tags: [python, discord, bot]
description: 디스코드 봇을 생성하고 서버에 연결시키기
---

> 이 글에서 다루는 내용
> - 디스코드 봇을 생성하는 방법
> - 테스트용 서버에 봇 추가하기

## 봇 생성하기

봇을 제작하고 기능을 넣기 위해서는 당연하게도 먼저 봇을 만들어야 한다. 그러기 위해서는 아래 단계들을 따르면 된다.

### 1. 애플리케이션 생성하기

먼저 [디스코드 개발자 포털(Discord Developer Portal)](https://discord.com/developers/applications)에 접속해 로그인을 해준다.

![](/assets/img/discord bot/1_0.png)

완료되면 아래처럼 [**애플리케이션**(application)](https://discord.com/developers/docs/game-sdk/applications)을 생성할 수 있는 개발자 포털 홈페이지가 나온다. 애플리케이션을 생성함으로써 인증 토큰을 제공받고 권한을 설정하는 등 디스코드 API와 상호작용할 수 있게 된다.

![](/assets/img/discord bot/1_1.png)

우측 상단의 <kbd>New Application</kbd>을 눌러 새로운 애플리케이션을 생성하자.

![](/assets/img/discord bot/1_2.png)

다음으로, 열린 창에 원하는 애플리케이션 이름을 설정하고 <kbd>Create</kbd>를 누른다.

![](/assets/img/discord bot/1_3.png)

이제 생성된 애플리케이션에 대한 정보가 화면에 뜬다. 여기서 아이콘, 이름과 설명 등을 수정할 수 있지만 봇을 사용하는 유저에게 직접적으로 보이지는 않는다.

> 봇 외에도 디스코드 API와 상호작용하는 모든 프로그램은 디스코드 애플리케이션이 필요하다.
{: .prompt-info }

하지만 우리는 봇을 만들 것이기 때문에 좌측 메뉴에서 <kbd>Bot</kbd> 탭을 눌러 이동해주자.

![](/assets/img/discord bot/1_4.png)

2024년 5월 기준으로는 봇을 따로 생성하지 않았어도 이미 봇이 생성되어 있다. 혹시나 아무것도 없다면 <kbd>Add Bot</kbd>을 눌러 생성해주면 된다. 

기본적으로 봇은 애플리케이션의 이름을 받아온다. 사람들에게 보여지는 봇 이름을 바꾸고 싶다면 USERNAME 칸을 수정하면 된다. 태그 숫자는 아쉽게도 바꾸는 방법이 없다. ~~원하는 태그가 나올 때까지 재생성하는 수밖에...~~

> 개발자 포털은 추후 다시 필요하니 글을 다 읽을 때까지 켜두자.
{: .prompt-tip}

드디어 봇을 생성했지만 아직 써먹을 공간이 없다. 이제 길드를 만들어 사용자와 같은 공간에 넣어보자.

### 2. 테스트용 길드(서버) 생성하기

디스코드 API를 사용해 본 적이 없다면 **길드(guild)**라는 용어가 생소할 것이다. 사실 우리가 흔히 디스코드에서 지칭하는 서버가 바로 길드이다. 개발을 하는 입장에서 디스코드의 서비스를 담당하는 본 서버와 구분 지어 말하기 위해 별도의 용어를 두는 것이다. 앞으로 나올 코드에서 보일 `guild`도 특정 디스코드 서버와 관련된 일을 수행하기 위해 사용된다고 보면 된다.

> 앞으로 작성할 글에서도 헷갈리지 않도록 **서버** 대신 **길드**를 사용할 것이다.
{: .prompt-info }

이미 내가 있는 길드에 봇을 초대할 수도 있지만 관리자 권한도 필요하고 테스트하려면 메시지도 보내고 아주 시끄러울 것이기에 아래 단계를 따라 전용 길드를 새로 파는 것을 추천한다.

![](/assets/img/discord bot/1_5.png)

길드를 만들려면 디스코드 앱이나 [홈페이지](https://discord.com/channels/@me)에 들어가서 좌측 상단의 <kbd>+</kbd> 아이콘을 눌러주면 된다. 

![](/assets/img/discord bot/1_6.png) | ![](/assets/img/discord bot/1_7.png)

이후 뜨는 창에서 <kbd>직접 만들기</kbd>를 선택한 후 <kbd>나와 친구들을 위한 서버</kbd>를 다시 선택해주자.

![](/assets/img/discord bot/1_8.png)

길드 이름을 입력해주고 <kbd>만들기</kbd>를 클릭하면 생성이 완료된다. 

![](/assets/img/discord bot/1_9.png)

화면 왼쪽의 길드 목록에도 방금 만든 길드가 보인다. 봇을 넣을 공간을 만들었으니 다음은 봇을 넣을 차례다.

### 3. 길드에 봇 추가하기

봇은 일반 사용자들처럼 초대를 보내 추가할 수 없다. 대신 [**OAuth2**](https://discord.com/developers/docs/topics/oauth2) 프로토콜을 사용한 인증을 통해 추가한다.

![](/assets/img/discord bot/1_10.png)

다시 [개발자 포털](https://discord.com/developers/applications)로 돌아가서 이번에는 <kbd>OAuth2</kbd> 탭으로 이동해준다. 아래에 **OAuth2 URL Generator**가 보이는데, 여기서 우리가 생성한 애플리케이션으로 디스코드 API에 접근하는 것을 허용하는 링크를 만들어준다.

> **Scope**는 애플리케이션에 부여하는 권한의 종류이다. (`read`, `write`, `update` 등)
{: .prompt-info }

![](/assets/img/discord bot/1_11.png)

**SCOPES**에서 **bot**에 체크하면 아래에 봇의 권한을 설정하는 **BOT PERMISSIONS**가 생기는데, 여기서 원하는 것만 골라담을 수 있긴 하지만 포괄적인 개발을 위해 가장 처음에 있는 **Administrator**를 체크해준다. 

![](/assets/img/discord bot/1_13.png)

완료되면 하단에 생성된 URL을 <kbd>Copy</kbd>로 복사해준다.

![](/assets/img/discord bot/1_14.png) | ![](/assets/img/discord bot/1_15.png)

복사한 URL을 브라우저에 붙여넣어주면 봇과 연결을 할 수 있는 창이 뜬다. 드롭다운 메뉴에서 아까 생성했던 길드를 선택해주고 <kbd>계속하기</kbd>와 <kbd>승인</kbd>을 차례대로 눌러주면 성공했다는 알림과 함께 봇이 길드에 추가된다.

![](/assets/img/discord bot/1_16.png)
![](/assets/img/discord bot/1_17.png)

디스코드 길드 인터페이스에도 봇이 입장했다는 메시지를 확인할 수 있다. 또, 화면 우측의 멤버 목록에서도 오프라인 상태인 봇을 볼 수 있다.

지금은 아무 기능이 없는 빈 깡통이지만 이제 무언가를 할 수 있게 만들어 볼 것이다.

## Python으로 봇 개발 시작하기

Python으로 개발을 하기 위해서는 [`discord.py`](https://discordpy.readthedocs.io/en/latest/#) 라이브러리를 받아줘야 한다. `discord.py`의 큰 장점은 Async I/O를 활용한 coroutine을 적극 사용하기 때문에 코드를 효율적으로 돌릴 수 있다는 점이다. ~~다른 애들은 안 그러나..?~~

### 1. 라이브러리 받기
먼저 `pip`으로 `discord.py`를 설치해준다.

```bash
$ pip install discord.py
```

### 2. 디스코드와 봇 연결시키기

명령어를 받고 답을 하려면 먼저 디스코드와 봇이 서로 통신이 되어야 한다. `discord.py`에는 통신을 위한 몇 가지 방법이 존재하는데 그 중에서 우선 [`Client`](https://discordpy.readthedocs.io/en/stable/api.html#clients)에 대해 다뤄볼 것이다.

`Client`는 기본적으로 디스코드와의 연결을 나타내는 객체라고 보면 되는데, 이를 활용해 디스코드 웹소켓과 API와의 상호작용이 가능하다. 아래는 `discord.py` documentation에서 제공하는 [기본적인 코드](https://discordpy.readthedocs.io/en/latest/quickstart.html#a-minimal-bot)다.

```python
# This example requires the 'message_content' intent.

import discord

intents = discord.Intents.default()
intents.message_content = True

client = discord.Client(intents=intents)

@client.event
async def on_ready():
    print(f'We have logged in as {client.user}')

@client.event
async def on_message(message):
    if message.author == client.user:
        return

    if message.content.startswith('$hello'):
        await message.channel.send('Hello!')

client.run('your token here')
```

코드를 보면 `client`를 먼저 설정하고 `on_ready()`와 `on_message()` 이벤트에 대한 event handler를 지정한 것을 볼 수 있다. 여기서 말하는 `event`는 메시지 전송이나 유저 밴, 길드 채널 생성과 같은 이벤트가 벌어졌을 때 디스코드가 보내는 일종의 데이터라고 보면 된다. `on_ready()`는 그 중에서 `Client`가 디스코드와의 연결을 성공했을 때 보내지는 이벤트로, 코드에서 설정한 `client`가 다음 명령을 받아들일 준비가 되었을 때 호출된다고 보면 된다. `on_message()`는 마찬가지로 메시지가 전송됐을 때 발동되는 함수이다.

> `discord.py`에서 다루는 이벤트 목록은 [여기서](https://discordpy.readthedocs.io/en/latest/api.html?highlight=event#discord-api-events) 확인할 수 있다.
{: .prompt-tip}

하지만 이 코드만 가지고 내 봇을 콕 집어 실행시킬 수 없는데, 이 때 필요한 것이 내 봇의 **토큰(token)**이다. 토큰은 봇의 고유 식별자로, 봇이 디스코드 API와 통신을 주고받는 데에 꼭 필요하다. 

![](/assets/img/discord bot/1_18.png)

다시 [개발자 포털](https://discord.com/developers/applications)로 돌아가 <kbd>Bot</kbd> 탭에서 <kbd>Reset Token</kbd> 버튼을 눌러주자.

![](/assets/img/discord bot/1_19.png) | ![](/assets/img/discord bot/1_20.png)

이후 뜨는 창에서 <kbd>Yes, do it!</kbd>를 누르고 디스코드 비밀번호를 입력한 후 <kbd>Submit</kbd>를 눌러주면 봇의 토큰이 재발급된다.

![](/assets/img/discord bot/1_21.png)

새로 발급된 토큰은 생성됐을 때만 노출되고 페이지를 새로고침하면 사라지게 된다. 그렇기 때문에 <kbd>Copy</kbd>로 복사해주고 어딘가 안전한 곳에 저장해야 한다. 토큰을 잊어버렸다면 다시 <kbd>Reset Token</kbd>으로 재발급해야 한다.

> **이 토큰은 봇의 권한을 총괄하는 비밀번호와 같으므로, 절대 공유해서는 안 된다.**
{: .prompt-danger }

만약 Public으로 설정된 깃허브 repository에 토큰을 업로드해 노출시켰다면, 깃허브에서 경고 메시지를 띄우고 디스코드에서도 새로운 토큰을 발급받도록 강제할 것이다.

![](/assets/img/discord bot/1_22.png)

스크롤을 내려 **Privileged Gateway Intents** 섹션에서 모든 **INTENT**를 활성화시키고 <kbd>Save Changes</kbd>를 눌러 저장해주자. 민감한 정보를 담고 있는 `GUILD_PRESENCES`, `GUILD_MEMBERS`, `MESSAGE_CONTENT` 등의 [**Gateway Intents**](https://discord.com/developers/docs/topics/gateway#gateway-intents)는 기본적으로 접근이 막혀있기 때문에 접근을 허용해주는 것이다. 

> 나중에 봇이 100개 이상의 서버에 추가되면 디스코드에서 Intents 활용이 적합한지 심사하게 된다.
{: .prompt-info}

일단 임시로 앞서 본 기본 코드에서 `your token here` 대신 발급받은 토큰을 붙여넣고 실행시켜보자.

![](/assets/img/discord bot/1_23.png)

정상적으로 실행되었다면 Python 터미널에 이런 로그가 출력된 것을 확인할 수 있다. 만일 **Privileged Gateway Intents** 설정이 제대로 되지 않았을 경우 오류가 발생할 수 있다.

> 이 에러가 뜬다면 **INTENTS**가 제대로 활성화가 되어 있는지 다시 한 번 확인해주자. 
> ```python
> discord.errors.PrivilegedIntentsRequired: Shard ID None is requesting privileged intents that have not been explicitly enabled in the developer portal. It is recommended to go to https://discord.com/developers/applications/ and explicitly enable the privileged intents within your application's page. If this is not possible, then consider disabling the privileged intents instead.
> ```
{: .prompt-warning}

![](/assets/img/discord bot/1_24.png)

그리고 방금까지만 해도 오프라인이었던 봇이 온라인으로 전환된 것을 확인할 수 있다. 드디어 빈 깡통에 생명을 불어넣은 것이다! 또 위에서 설정했듯이 `'$hello'`로 시작되는 메시지를 입력하면,

![](/assets/img/discord bot/1_25.png)

봇이 정해둔 답을 채팅으로 응답한다. 