---
title: 디스코드 봇 DIY - 3.  신규 멤버 환영 메시지
date: 2024-05-27 10:53:19 +/-TTTT
lastmod: 2022-05-29 17:49:33 +/-TTTT
categories: [Python, discord.py]
tags: [python, discord, bot, event]
description: 디스코드 이벤트 활용해서 환영 메시지 보내기
---

> 이 글에서 다루는 내용
> - 이벤트 종류 이해하기
> - 새로운 멤버가 들어올 때 환영 DM 보내기
> - 길드별로 메시지 보낼 채널 설정하기 

## 이벤트 카테고리

아직까지 글에서 다룬 이벤트는 `on_ready()`와 `on_message()` 밖에 없지만 디스코드에는 특수한 상황들이 이보다 훨씬 많이 있다. 이번에는 이벤트의 종류에는 무엇이 있고 봇이 그것들을 어떻게 활용할 수 있을지 알아볼 것이다.

> 이벤트에 대응하는 함수는 앞에 `async def`를 붙여 coroutine으로 정의되어야 한다. 
{: .prompt-warning}

아래는 `discord.py`에서 나눠놓은 이벤트 카테고리들을 표로 만들어 가져왔다. [**Event Reference** 페이지](https://discordpy.readthedocs.io/en/latest/api.html?#discord-api-events)에서 본인이 만들고자 하는 기능과 상응하는 카테고리로 이동해 해당하는 이벤트를 찾으면 수월한 개발이 가능하다. Intents를 `discord.Intents.all()`로 설정하지 않고 필요한 것만 따로 설정할 생각이라면 카테고리별 intents 필요사항을 확인하면 된다.  

| 카테고리         | 설명                         | Intents 추가 필요사항                                    |
| :--------------- | :--------------------------- | :------------------------------------------------------- |
| App commands     | 기본적인 앱 기능 관련        |                                                          |
| AutoMod          | AutoMod(자동 검열 기능) 관련 | `auto_moderation_configuration`                          |
| Channels         | 채팅/음성 채널 관련          | `guilds`, `messages`, `typing`                           |
| Connection       | 클라이언트의 연결 생성 여부  |                                                          |
| Debug            | 오류와 웹소켓 이벤트 관련    |                                                          |
| Entitlements     | 프리미엄 앱 유료 서비스 관련 |                                                          |
| Gateway          | 클라이언트의 연결 준비 여부  |                                                          |
| Guilds           | 특정 길드 내 이벤트 관련     | `guilds`, `emojis_and_stickers`, `moderation`, `invites` |
| Integration      | 타 서비스와의 연동 관련      | `integrations`, `webhooks`                               |
| Interactions     | 상호작용 발생 시             |                                                          |
| Members          | 길드 내 멤버 관련            | `members`, `moderation`, `presences`                     |
| Message          | 메시지 전송 관련             | `messages`                                               |
| Polls            | 투표 관련                    | `message_content`, `polls`                               |
| Reactions        | 메시지 반응 관련             | `reactions`, `members`                                   |
| Roles            | 길드 내 역할 관련            | `guilds`                                                 |
| Scheduled Events | 예정된 이벤트 관련           | `guild_scheduled_events`                                 |
| Stages           | 스테이지 채널 관련           |                                                          |
| Threads          | 길드 스레드 관련             | `guilds`, `members`                                      |
| Voice            | 음성 채팅 관련               | `voice_states`                                           |

이번 글에서는 새로운 멤버가 길드에 참가할 때 여러가지를 시도해보려 한다. 그러니 멤버들과 관련된 카테고리인 **Members**에서 길드 참가와 관련된 이벤트를 확인하면 된다. `discord.py` API 문서를 확인하면 `on_member_join()`이 내가 찾는 이벤트인 것을 알 수 있다.

## 신규 유저 관리하기

길드에 새로운 멤버가 참가할 때는 이 멤버가 길드에 잘 녹아들게 하면서도 취지에 맞지 않는 행동을 막는 것이 중요하다. 공지사항을 통해  커뮤니티 길드 같은 경우에는 규칙에 동의해야 길드 이용이 가능한 *규칙 심사* 기능이 있긴 하지만, 커뮤니티 활성화를 하지 않으면 사용할 수 없다. 

꼭 규칙이 아니더라도 기본적인 정보들을 전달해주면 참여도가 높아질 가능성이 커진다. 기존 유저들이 있는 상황에서 아무것도 모르는 상태로 길드에 참여해서 활동하는 건 어지간히 어렵기 때문이다. 그래서 신규 멤버가 들어올 때 규칙과 정보를 전달할 수 있도록 봇을 설정해두는 길드들이 많이 있다.

### 1. 길드 참가 환영 DM 보내기

디스코드에도 자체적으로 길드에 참가할 때 보내지는 메시지가 있다. 하지만 원하는 메시지를 보내거나, 꼭 메시지가 아니더라도 참가할 때 역할 선택 같은 절차를 밟게 만드려면 위에서 언급한 `on_member_join()` 이벤트를 활용하면 된다.

```python
@bot.event
async def on_member_join(member):
    await member.send(f"{member.name}님, 반갑습니다.")
```

`on_member_join()`에는 들어온 멤버가 parameter로 설정되어 있기 때문에 받아온 `member` 객체를 활용해 호출될 함수를 짜주면 된다. 

> `discord.Intents.default()`로 해놨다면 `intents.members = True`를 따로 설정을 해주어야 한다.
{: .prompt-warning}

![](/assets/img/discord%20bot/3_1.png)

`member.send()`를 통해 정해진 메시지가 참가한 멤버에게 DM으로 보내지게 된다. 지금은 단순한 메시지만 한 줄 보냈지만 서버 규정 같은 중요한 내용을 따로 보낼 수도 있겠다. 다만 DM으로 보낼 때의 단점이 명확한데, 만약 사용자가 친구가 아닌 사용자의 **DM을 차단**시켜놓았다면 메시지가 제대로 전달되지 않는다는 점이다. 때문에 길드 내의 채널을 활용하는 편이 나을 수 있다.

### 2. 길드 채널에 환영 메시지 보내기

DM이 안 된다면 글을 보낼 수 있는 남은 공간은 길드의 채팅 채널이다. 명령어를 다룰 때는 `ctx`로 명령어를 입력한 채널의 정보를 불러와 다시 메시지를 보낼 수 있었지만, `on_member_join()`에는 채널 정보 없이 `member`만 주어진다. 그렇기 때문에 채널에 메시지를 보내려면 직접 채널 ID를 가져와야 한다.

![](/assets/img/discord%20bot/3_2.png)

바로 확인은 할 수 없고 **개발자 모드**를 활성화해야 한다. 아래 톱니바퀴를 눌러 사용자 설정에 들어가자.

![](/assets/img/discord%20bot/3_3.png)

왼쪽 목록에서 **앱 설정** 아래 있는 **고급**에 들어가고 첫번째 항목인 **개발자 모드**를 활성화하면 된다.

![](/assets/img/discord%20bot/3_4.png)

이제 서버로 돌아가 봇이 채팅을 보냈으면 하는 채팅 채널을 우클릭하면 **채널 ID 복사하기**가 뜰 것이다. ID를 복사했으면 이제 코드에 써먹어보자.

```python
@bot.event
async def on_member_join(member):
    channel = bot.get_channel(채널 ID)
    await member.send(f"{member.name}님, 반갑습니다.")
    await channel.send(f"{member.display_name}님이 서버에 참가하셨습니다.")
```

채널 ID는 봇 토큰과 다르게 int type이니 따옴표 없이 그대로 괄호 안에 붙여주면 된다. 

![](/assets/img/discord%20bot/3_5.png)

깡통계정으로 서버에 들어오니 채널에 메시지를 보내는 모습을 확인할 수 있다. 지금은 채널이 한 개 밖에 없어서 채널 ID를 그대로 붙여넣기했지만 채널이 여러 개라면 원하는 채널에 보낼 수 있도록 변수 처리하는 편이 나을 것이다.

또 다른 문제도 있다. 지금은 테스트용 길드 하나만 두고 하고 있지만 보통 디스코드 봇을 개발하면 여러 개의 길드에 참가하게 된다. 그렇다면 지금 메시지를 보내도록 설정된 채널이 속한 길드가 아닌, **내 봇이 존재하는 다른 길드**에 참가하더라도 정해진 채널에 모든 환영 메시지가 모이게 된다.

![](/assets/img/discord%20bot/3_6.png)

길드를 하나 더 파서 봇을 추가하고 깡통계정을 초대해 보았다. 그러니 새로 판 길드가 아닌 원래 있던 길드에 환영 메시지가 재출력되는 것을 확인할 수 있었다. 이제 이 문제를 어떻게 해결할지 알아보자.

### 3. 길드 특정하기

채널 ID를 확인하기 위해 개발자 옵션을 활성화했으니 마찬가지로 길드 ID도 디스코드 인터페이스에서 확인할 수 있다.

![](/assets/img/discord%20bot/3_7.png)

상단의 길드 이름을 우클릭하고 **서버 ID 복사하기**를 눌러주면 복사가 된다. 지금 테스트하고 있는 서버에서 계속 테스트를 진행할 것이기 때문에 `.env` 파일에 `GUILD_ID` 항목을 추가해서 복사한 숫자를 넣어줬다. 

```text
# .env
BOT_TOKEN={봇 토큰}
GUILD_ID={길드 ID}
```

```python
load_dotenv()
TOKEN = os.getenv('BOT_TOKEN')
GUILD = int(os.getenv('GUILD_ID'))
```

`.env`에서 받아올 때 string으로 받아오기 때문에 원래 int type인 `GUILD_ID`를 다시 int로 변환해 주었다. 

```python
@bot.event
async def on_ready():
    guild = discord.utils.find(lambda g: g.id == GUILD, bot.guilds)
    print(
        f"{bot.user}(으)로 접속했습니다.\n"
        f"접속 길드: {guild.name} (ID: {guild.id})"
    )
```

`on_ready()` 이벤트에 길드 정보도 추가해 주기로 했다. `utils.find()`라는 `discord.py` 함수를 통해 `bot.guilds`, 즉 봇이 연결을 마친 길드들 중에서 `.env`에서 불러온 ID와 같은 ID를 가지고 있는 길드를 찾아냈다. 이렇게 디스코드 서버와의 연결을 확인하는 것을 넘어 테스트 중인 길드에 연결을 마쳤는지 확인이 가능하다. 

```python
guild_channel = {길드_ID:채널_ID}
```

`guild_channel`이라는 dictionary를 만들어서 길드 ID를 key로 설정하고 그 길드에서 메시지를 보낼 채널 ID를 value로 넣었다.

```python
@bot.event
async def on_member_join(member):
    guild_id = guild_channel.get(member.guild.id, None)
    if guild_id is not None:
        channel = bot.get_channel(guild_id)
        await channel.send(f"{member.display_name}님이 서버에 참가하셨습니다.")
```

다음으로 `on_member_join()`의 argument로 주어진 `member`가 방금 참가한 길드의 ID를 dictionary의 `get()` 함수에 넣어 상응하는 채널 ID를 따온 후 해당 채널에 메시지를 출력하도록 설정했다. 이러면 길드마다 각각 설정된 채널로 환영 메시지를 전송할 수 있다. 

지금은 한 개의 길드에 대해 직접 ID를 코드에 적어 넣었지만, 길드 관리자가 환영 메시지를 보낼 채널을 봇에게 설정하도록 할 수도 있겠다. 길드마다 설정을 저장하려면 데이터베이스를 먼저 짜야하기 때문에 좀 나중에 다시 돌아오는 편이 나을 거 같다고 생각했다. 다음은 기본적인 사용자 정보를 저장할 수 있는 데이터베이스를 만들어 볼 것이다.

## 부록

### i. 전체 코드

```python
# bot.py
import os, discord
from discord.ext import commands
from dotenv import load_dotenv

load_dotenv()
TOKEN = os.getenv('BOT_TOKEN')
GUILD = int(os.getenv('GUILD_ID'))
CHANNEL = int(os.getenv('CHANNEL_ID'))
guild_channel = {GUILD:CHANNEL}

intents = discord.Intents.all()

bot = commands.Bot(command_prefix='$', intents=intents)

@bot.event
async def on_ready():
    guild = discord.utils.find(lambda g: g.id == GUILD, bot.guilds)
    print(
        f"{bot.user}(으)로 접속했습니다.\n"
        f"접속 길드: {guild.name} (ID: {guild.id})"
    )
    
@bot.event
async def on_member_join(member):
    guild_id = guild_channel.get(member.guild.id, None)
    if guild_id is not None:
        channel = bot.get_channel(guild_id)
        await channel.send(f"{member.display_name}님이 서버에 참가하셨습니다.")

@bot.command(name='hello', help="인사를 합니다")
async def hello(ctx):
    await ctx.send("Hello!")

@bot.command(name='곱하기', help="숫자 두 개를 곱합니다")
async def multiply(ctx, first_int: int, second_int: int):
    product = first_int * second_int
    await ctx.send(f"결과는 {product}입니다.")

@multiply.error
async def multiply_error(ctx, error):
    if isinstance(error, commands.BadArgument):
        await ctx.send("오류: 정수 두 개를 입력해 주세요.")
        
@bot.command(name='참가일', help="멤버의 서버 참가 날짜를 알려줍니다")
async def joined(ctx, member: discord.Member):
    join_date = member.joined_at.strftime("%Y-%m-%d")
    await ctx.send(f"{member.display_name}님은 {join_date}에 서버에 참가했습니다.")

bot.run(TOKEN)
```

### ii. 폴더 구조

```tree
📦Discord Bot
 ┣ 📜.env
 ┗ 📜bot.py
 ```