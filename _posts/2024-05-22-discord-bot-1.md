---
title: 디스코드 봇 DIY - 1. 디스코드 봇 생성
date: 2024-05-22 09:31:20 +/-TTTT
last_modified_at: 2024-05-24 11:07:00 +/-TTTT
categories: [Python, discord.py]
tags: [python, discord, bot]
description: 디스코드 봇을 생성하고 채팅에 대답하게 하기
---

> 이 글에서 다루는 내용
> - 디스코드 봇을 생성하는 방법
> - 테스트용 서버에 봇 추가하기
> - Python으로 개발 설정하기
> - 봇이 채팅에 응답하게 하기

## 봇 생성하기

봇을 제작하고 기능을 넣기 위해서는 당연하게도 그 기능을 넣을 봇을 먼저 만들어야 한다. 디스코드 봇을 생성하기 위해서는 아래 단계들을 따르면 된다.

### 1. 애플리케이션 생성하기

먼저 [디스코드 개발자 포털(Discord Developer Portal)](https://discord.com/developers/applications)에 접속해 로그인을 해준다. 만약 디스코드 계정이 없다면 <kbd>가입하기</kbd>를 눌러 계정을 먼저 만들어 준다. 

![](/assets/img/discord%20bot/1_0.png)

완료되면 아래처럼 애플리케이션(Application)을 생성할 수 있는 개발자 포털 홈페이지가 나온다. 애플리케이션을 생성함으로써 인증 토큰을 제공받고 권한을 설정하는 등 디스코드 API와 상호작용을 할 수 있게 된다.

![](/assets/img/discord bot/1_1.png)

우측 상단의 <kbd>New Application</kbd>을 눌러 새로운 애플리케이션을 생성하자.

![](/assets/img/discord bot/1_2.png)

다음으로, 열린 창에 원하는 애플리케이션 이름을 설정하고 <kbd>Create</kbd>를 누른다.

![](/assets/img/discord bot/1_3.png)

이제 생성된 애플리케이션에 대한 정보가 화면에 뜬다. 여기서 아이콘, 이름과 설명 등을 수정할 수 있지만 애플리케이션 정보는 봇을 이용하는 사용자에게 직접적으로 보이지는 않는다.

> 봇 외에도 디스코드 API와 상호작용을 하는 모든 프로그램은 [디스코드 애플리케이션](https://discord.com/developers/docs/game-sdk/applications)이 필요하다.
{: .prompt-info }

우리는 봇을 만들 것이기 때문에 좌측 메뉴에서 <kbd>Bot</kbd> 탭을 눌러 이동해 주자.

![](/assets/img/discord bot/1_4.png)

2024년 5월 기준으로는 봇을 따로 생성하지 않았어도 이미 봇이 생성되어 있다. 혹시나 아무것도 없다면 <kbd>Add Bot</kbd>을 눌러 생성해 주면 된다. 

기본적으로 봇은 애플리케이션의 이름을 받아온다. 사람들에게 보이는 봇 이름을 바꾸고 싶다면 **USERNAME** 칸을 수정하면 된다. 사람들에게 보이는 아이콘과 배너도 각각 **ICON**과 **BANNER**에서 수정이 가능하다. 태그 숫자는 아쉽게도 바꾸는 방법이 없다. ~~원하는 태그가 나올 때까지 재생성하는 수밖에...~~

> 개발자 포털은 추후 다시 필요하니 글을 다 읽을 때까지 켜두면 좋다.
{: .prompt-tip}

드디어 봇을 생성했지만 아직 가지고 놀 공간이 없다. 이제 길드를 만들어 사용자와 같은 공간에 넣어보자.

### 2. 테스트용 길드 생성하기

디스코드 API를 사용해 본 적이 없다면 **길드(Guild)**라는 용어가 생소할 것이다. 사실 우리가 흔히 디스코드에서 지칭하는 서버가 바로 길드이다. 개발하는 입장에서는 디스코드의 서비스를 담당하는 본 서버와 커뮤니티로써의 서버를 구분 지어 말하기 위해 별도의 용어를 두는 것이다. 앞으로 나올 코드에서 보일 `guild`도 특정 디스코드 서버와 관련된 일을 수행하기 위해 사용된다고 보면 된다.

> 앞으로 작성할 글에서도 정확히 구분 짓기 위해 **서버** 대신 **길드**를 사용할 것이다.
{: .prompt-info }

이미 내가 참가하고 있는 길드에 봇을 초대할 수도 있지만, **관리자 권한**도 필요하고 무엇보다 봇을 테스트하려면 메시지도 보내고 **아주 시끄러울 것**이기 때문에 아래 단계를 따라 전용 길드를 새로 파는 것을 추천한다.

![](/assets/img/discord bot/1_5.png)

새 길드를 만들려면 디스코드 앱이나 [홈페이지](https://discord.com/channels/@me)에 들어가서 화면 좌측 길드 목록의 끝에 있는 <kbd>+</kbd> 아이콘을 눌러주면 된다. 

![](/assets/img/discord bot/1_6.png) | ![](/assets/img/discord bot/1_7.png)

이후 뜨는 창에서 <kbd>직접 만들기</kbd>를 선택한 후 <kbd>나와 친구들을 위한 서버</kbd>를 다시 선택해 주자.

![](/assets/img/discord bot/1_8.png)

길드 이름을 입력해 주고 <kbd>만들기</kbd>를 클릭하면 생성이 완료된다. 

![](/assets/img/discord bot/1_9.png)

화면 왼쪽의 길드 목록에도 방금 만든 길드가 보인다. 봇을 넣을 공간은 준비됐으니 다음은 봇을 넣을 차례다.

### 3. 길드에 봇 추가하기

봇은 일반 사용자들처럼 초대를 보내 추가할 수 없다. 대신 [**OAuth2**](https://discord.com/developers/docs/topics/oauth2) 프로토콜을 사용한 인증을 통해 추가한다.

![](/assets/img/discord bot/1_10.png)

다시 [개발자 포털](https://discord.com/developers/applications)로 돌아가서 이번에는 <kbd>OAuth2</kbd> 탭으로 이동해 준다. 아래에 **OAuth2 URL Generator**가 보이는데, 여기서 우리가 생성한 애플리케이션으로 디스코드 API에 접근하는 것을 허용하는 링크를 만들어준다.

> **Scope**는 애플리케이션에 부여하는 권한의 종류이다. (`read`, `write`, `update` 등)
{: .prompt-info }

![](/assets/img/discord bot/1_11.png)

**SCOPES**에서 **bot**에 체크하면 아래에 봇의 권한을 설정하는 **BOT PERMISSIONS**가 생기는데, 여기서 기능에 해당하는 것만 골라 담을 수 있긴 하지만 포괄적인 개발을 위해 가장 처음에 있는 **Administrator**를 체크해 준다. 

![](/assets/img/discord bot/1_13.png)

완료되면 하단에 생성된 URL을 <kbd>Copy</kbd>로 복사해 준다.

![](/assets/img/discord bot/1_14.png) | ![](/assets/img/discord bot/1_15.png)

복사한 URL을 브라우저에 붙여넣기해 주면 봇과 연결을 할 수 있는 창이 뜬다. 드롭다운 메뉴에서 아까 생성했던 길드를 선택하고 <kbd>계속하기</kbd>와 <kbd>승인</kbd>을 차례대로 누르면 성공했다는 알림과 함께 봇이 길드에 추가된다.

![](/assets/img/discord bot/1_16.png)
![](/assets/img/discord bot/1_17.png)

디스코드 길드의 채널에서도 봇이 입장했다는 메시지를 확인할 수 있다. 또한 화면 우측의 멤버 목록에서도 오프라인 상태인 봇을 볼 수 있다.

지금은 아무 기능이 없는 말 그대로 빈 깡통이지만 이제 무언가를 할 수 있게 만들어 볼 것이다.

## Python으로 봇 개발 시작하기

Python으로 개발을 하기 위해서 `discord.py` [라이브러리](https://discordpy.readthedocs.io/en/latest/#)를 사용할 것이다. `discord.py`의 큰 장점은 Async I/O를 활용한 coroutine을 적극 사용하기 때문에 코드를 효율적으로 돌릴 수 있다는 점이다. ~~다른 것들은 안 그러나..?~~

### 1. 라이브러리 받기
먼저 `pip`으로 `discord.py`를 설치해 준다.

```bash
$ pip install discord.py
```

### 2. 디스코드와 봇 연결시키기

명령어를 받고 답을 하려면 먼저 디스코드와 봇이 서로 통신이 되어야 한다. `discord.py`에는 통신을 위한 몇 가지 방법이 존재하는데 그중에서 우선 [**Client**](https://discordpy.readthedocs.io/en/stable/api.html#clients)에 대해 다뤄볼 것이다.

`discord.Client`는 디스코드와의 연결을 나타내는 기본적인 객체라고 보면 되는데, 이를 활용해 디스코드 웹소켓과 API와의 상호작용이 가능하다. 아래는 `discord.py` documentation에서 제공하는 [간단한 시작 코드](https://discordpy.readthedocs.io/en/latest/quickstart.html#a-minimal-bot)다. 이번 글에서는 이 코드를 활용해 볼 것이다.

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

코드를 보면 `client`를 먼저 설정하고 `on_ready()`와 `on_message()`라는 **이벤트(Event)**들에 대한 Event Handler를 지정한 것을 볼 수 있다. 여기서 말하는 이벤트는 메시지 전송, 사용자 밴과 채널 생성처럼 상태에 변화가 생겼을 때 디스코드가 호출하는 일종의 함수라고 이해하면 된다. `on_ready()`는 그중에서 `Client`가 디스코드와의 연결을 성공했을 때 보내지는 이벤트로, 봇이 사용자와 상호작용을 할 준비가 되었을 때 호출된다고 보면 된다. 

`on_message()`는 봇이 속한 길드에서 메시지가 전송됐을 때 발동되는 이벤트이다.

> `discord.py`에서 다루는 이벤트 목록은 [여기서](https://discordpy.readthedocs.io/en/latest/api.html?#discord-api-events) 확인할 수 있다.
{: .prompt-info}

하지만 이벤트 함수만 가지고 내 봇을 콕 집어 실행시킬 수 없는데, 이때 필요한 것이 내 봇의 **토큰(Token)**이다. 토큰은 봇의 고유 식별자로, 봇이 디스코드 API와 통신을 주고받는 데에 꼭 필요하다. 

![](/assets/img/discord bot/1_18.png)

다시 [개발자 포털](https://discord.com/developers/applications)로 돌아가 <kbd>Bot</kbd> 탭에서 <kbd>Reset Token</kbd> 버튼을 눌러주자.

![](/assets/img/discord bot/1_19.png) | ![](/assets/img/discord bot/1_20.png)

이후 뜨는 창에서 <kbd>Yes, do it!</kbd>를 누르고 디스코드 비밀번호를 입력한 후 <kbd>Submit</kbd>를 눌러주면 봇의 토큰이 재발급된다.

![](/assets/img/discord bot/1_21.png)

새로 발급된 토큰은 생성됐을 때만 노출되고 페이지를 닫거나 새로고침하면 사라진다. 그렇기 때문에 <kbd>Copy</kbd>로 복사해 주고 어딘가 안전한 곳에 저장해야 한다. 토큰을 잃어버렸다면 <kbd>Reset Token</kbd>으로 재발급할 수 있다.

> **이 토큰은 봇의 권한을 총괄하는 비밀번호와 같으므로, 절대 타인과 공유해서는 안 된다.**
{: .prompt-danger }

> **Public 깃허브 리포지토리**에 토큰을 업로드하면 디스코드에서 **새로운 토큰을 발급받도록 강제**한다.
{: .prompt-warning}

![](/assets/img/discord bot/1_22.png)

[**인텐트(Intent)**](https://discord.com/developers/docs/topics/gateway#gateway-intents)는 디스코드가 보내는 이벤트의 종류를 설정하는 값인데, 민감한 정보를 담고 있는 `GUILD_PRESENCES`, `GUILD_MEMBERS`, `MESSAGE_CONTENT` 등의 Privileged Gateway Intents는 기본적으로 접근이 막혀있기 때문에 접근을 허용해 주어야 한다. 스크롤을 내려 **Privileged Gateway Intents** 섹션에서 모든 인텐트를 활성화하고 <kbd>Save Changes</kbd>를 눌러 저장해 주자.

> 나중에 봇이 100개 이상의 서버에 추가되면 디스코드에서 인텐트 활용이 적합한지 심사한다.
{: .prompt-info}

```python
# This example requires the 'message_content' intent.

import discord

intents = discord.Intents.all() # default에서 all로 변경
intents.message_content = True
...
```

모든 인텐트를 활성화했으므로 코드에서도 `discord.Intents.default()`를 `discord.Intents.all()`로 바꿔주었다. 이러면 앞으로 인텐트 권한 때문에 고통받을 일은 없다. 이제 코드의 가장 아랫줄에서 `'your token here'` 대신 발급받은 토큰을 붙여넣기하여 실행시켜 보자.

<img src="/assets/img/discord bot/1_23.png" alt="1_23" style="display: block; margin-left: auto; margin-right: auto; width: 80%;">

정상적으로 실행되었다면 `on_ready()`에 적은 대로 터미널에 이런 로그가 출력된 것을 확인할 수 있다. 만일 Privileged Gateway Intents 설정이 제대로 되지 않았을 경우에는 아래와 같은 오류가 발생할 수 있다.

```terminal
discord.errors.PrivilegedIntentsRequired: Shard ID None is requesting privileged intents that have not been explicitly enabled in the developer portal. It is recommended to go to https://discord.com/developers/applications/ and explicitly enable the privileged intents within your application's page. If this is not possible, then consider disabling the privileged intents instead.
```

> 이 오류가 뜬다면 **Privileged Gateway Intents 설정**이 제대로 되어 있는지 웹사이트를 다시 확인하자. 
{: .prompt-warning}

![](/assets/img/discord bot/1_24.png)

정상적으로 실행됐다면 방금까지만 해도 오프라인이었던 봇이 **온라인**으로 전환된 것을 확인할 수 있다. 드디어 빈 깡통에 생명을 불어넣은 것이다! 

<img src="/assets/img/discord bot/1_25.png" alt="1_25" style="display: block; margin-left: auto; margin-right: auto; width: 60%;">

또 코드에서 설정했듯이 `'$hello'`로 시작되는 메시지를 입력하면 봇이 정해둔 답을 채팅으로 보낸다. 

### 3. 환경 변수 설정하기

나 혼자서 봇과 놀 심상이면 상관없겠지만, 최종적으로 봇을 배포하는 것이 목표이므로 코드에 봇 토큰을 그대로 남겨둘 수 없다. 그렇기 때문에 `.env` 파일을 활용해 토큰을 저장할 것이다. 

```tree
📦Discord Bot
 ┣ 📜.env
 ┗ 📜bot.py
 ```

```text
# .env
BOT_TOKEN={봇 토큰}
```

봇을 구동하는 Python 파일과 같은 폴더에 `.env` 파일을 생성하고 그 안에 `BOT_TOKEN` 환경 변수를 만들어 토큰을 지정해 주자.

```bash
pip install -U python-dotenv
```

코드를 실행할 때 `.env` 파일에서 토큰을 읽어오게 하면 되는데, Python에서 `.env` 파일을 읽기 위해서는 `dotenv` 라이브러리가 필요하니 없다면 설치하도록 하자.

```python
# This example requires the 'message_content' intent.

import discord
import os
from dotenv import load_dotenv

load_dotenv()

TOKEN = os.getenv('BOT_TOKEN')
...
```

다시 코드로 돌아와서 필요한 라이브러리를 import하고 환경 변수를 가져오는 코드를 추가했다. `load_dotenv()`가 `.env` 파일 내의 모든 환경 변수들을 불러와 사용할 수 있게끔 해준다.

```python
...
client.run(TOKEN)
```

마지막으로 실제 토큰이 있던 자리를 불러온 `BOT_TOKEN`으로 교체해 주면 끝이다.

---

당장 봇이 할 수 있는 건 조건문으로 설정한 내 메시지에 응답하는 것뿐이지만, 이것만 해도 ~~혼자~~ 단둘이 있는 적막한 서버에서 나와 놀아주는 사람이 있는 듯한 기분을 낼 수 있다. 다음 글에서는 단순히 채팅하는 것을 넘어 `discord.ext.commands` 확장 라이브러리를 활용해 명령어를 만들어 볼 것이다.

## 부록

### i. 전체 코드

```python
# bot.py
import os, discord
from dotenv import load_dotenv

load_dotenv()
TOKEN = os.getenv('BOT_TOKEN')

intents = discord.Intents.all()

client = discord.Client(intents=intents)

@client.event
async def on_ready():
    print(f'{client.user}(으)로 접속했습니다.')

@client.event
async def on_message(message):
    if message.author == client.user:
        return

    if message.content.startswith('$hello'):
        await message.channel.send('Hello!')

client.run(TOKEN)
```

### ii. 폴더 구조

```tree
📦Discord Bot
 ┣ 📜.env
 ┗ 📜bot.py
 ```