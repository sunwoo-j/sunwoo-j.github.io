---
title: 디스코드 봇 DIY - 6.  Cog로 코드 정리하기
date: 2024-06-25 14:42:37 +/-TTTT
last_modified_at: 2024-06-25 14:42:37 +/-TTTT
categories: [Python, discord.py]
tags: [python, discord, bot, modularization]
description: Cog를 이용해 기능별로 모듈화하기
---

> 이 글에서 다루는 내용
> - 카테고리별로 파일 만들어서 관리하기
> - 메인 파일에 생성한 Cog들 불러오기

## Cog

**Cog**는 `discord.py`에서 모듈이나 익스텐션을 뜻하는 용어이다. 지금은 `bot.py`에 모든 명령과 기능들이 다 합쳐져 있지만 Cog를 사용하면 카테고리별로 묶어 관리하는 것이 가능해진다. 이러면 자연스럽게 이것저것 다 섞여 있던 `bot.py`처럼 코드가 엉망이 되는 것을 방지할 수 있다.

> Cog에 대한 예시와 자세한 설명은 [이곳](https://discordpy.readthedocs.io/en/stable/ext/commands/cogs.html)에서 볼 수 있다.
{: .prompt-info}

앞으로 만들 기능들을 생각하면 아직 1%도 안한 느낌이지만, 미리 모듈화하여 더 복잡해지기 전에 관리를 시작하는 편이 좋을 것이다. 

### 1. Cog 파일 생성하기

먼저, `bot.py`가 있는 폴더 안에 `cogs/` 폴더를 생성해준다. 이 폴더 안에 앞으로 만들 Cog 파일들을 전부 보관할 것이다. 멤버가 새로 들어왔을 때 메시지를 출력하는 기능과 환영 Embed를 출력하는 기능은 환영이라는 주제에 들어맞기 때문에 폴더 안에 `welcome.py` 파일을 만들어 Cog를 만들어 보겠다.

```python
# /cogs/welcome.py
import discord
from discord import app_commands
from discord.ext import commands
from datetime import datetime

class Welcome(commands.Cog):
    def __init__(self, bot):
        self.bot = bot
        
    @commands.Cog.listener()
    async def on_member_join(self, member):
        channel = member.guild.system_channel
        if channel is not None:
            await channel.send(f"{member.display_name}님이 서버에 참가하셨습니다.")
    
    @app_commands.command(name='hello', description="인사를 합니다")
    async def hello(self, interaction: discord.Interaction):
        embed = discord.Embed(
            title=":raised_hands: 반갑습니다!",
            description="서버에 오신 것을 환영합니다.",
            color=discord.Color.gold(),
            timestamp=datetime.now(),
            url='https://sunwoo-j.github.io/'
        )
        embed.add_field(name="동해물과 백두산이", value="마르고 닳도록 하느님이 보우하사 우리나라 만세", inline=False)

        embed.add_field(name="무궁화 삼천리", value="화려강산", inline=True)
        embed.add_field(name="대한사람", value="대한으로", inline=True)
        embed.add_field(name="길이 보전하세", value="(간주)", inline=True)
        
        file = discord.File('./icon.gif')
        
        embed.set_author(name="디스코드 봇 DIY", icon_url='attachment://icon.gif')
        embed.set_thumbnail(url='https://picsum.photos/100/100')
        embed.set_field_at
        embed.set_image(url='https://picsum.photos/600/400')
        embed.set_footer(text="Footer가 들어가는 공간", icon_url='attachment://icon.gif')
    
        await interaction.response.send_message("안녕하세요", embed=embed, file=file)
    
async def setup(bot):
    await bot.add_cog(Welcome(bot))
```

Cog는 `discord.ext.commands`에 속해있기 때문에 `commands.Cog`를 상속하는 class를 우선 만들어 준다. `bot.py`에서 이벤트를 확인할 때는 `@bot.event` decorator를 사용했지만, Cog의 경우에는 `@commands.Cog.listener()` decorator를 대신 사용해야 한다. 마찬가지로 Application Command도 `@bot.tree.command` 대신 `@application_commands.command`로 바꿔주면 된다.

> 일반적인 `@bot.command()` 명령어는 `@commands.command()`로 바꿔주면 된다.
{: .prompt-info}

> Cog에 추가한 명령어와 실행 모듈에 있는 명령어 **이름이 같으면** 오류가 발생한다.
{: .prompt-warning}

Class에 기능들을 넣었다면 마지막에 `setup()`으로 Cog를 Bot에 등록하는 함수를 만들어 주면 끝이다.

### 2. 메인 모듈에 Cog 연결하기

Cog에 기능들을 추가해도 실행하는 건 `welcome.py`이 아니기 때문에 봇에 반영이 되지 않는다. 봇에 추가한 기능들을 반영하려면 실행되는 메인 모듈인 `bot.py`에 Cog를 연결시켜야 한다. 

```python
# bot.py
...
async def load_extensions():
    await bot.load_extension('cogs.welcome')
...
```

이 함수를 우선 `bot.py`에 추가하자. `load_extension()`은 앞서 `setup()`으로 등록 해놓은 Cog를 불러오는 함수로, argument는 Cog 파일 경로에서 확장명을 제외하고 `/`를 `.`으로 대치한 string을 넣어주면 된다. 우리의 경우 경로가 `cogs/welcome.py`이므로 `cogs.welcome`이 된다.

```python
# bot.py
...
@bot.event
async def setup_hook():
    await load_extensions()
    await bot.tree.sync() # tree 동기화
...
```

추가한 함수를 `setup_hook` event에 넣어서 봇이 서버에 로그인을 성공했을 때 Cog를 불러올 수 있도록 설정해주자. `load_extensions()`는 coroutine으로 `async` 함수 안에 추가해야 하는데, `on_ready`은 여러 번 호출될 수 있는 반면에 `setup_hook`은 실행 시 단 한 번만 호출되므로 Cog를 추가하는 목적에 적합하다. (이유는 잘 모르겠지만 `on_ready`에 넣으니 동작을 하지 않는다)

### 3. View 및 인터페이스 Cog로 옮기기

UI 요소를 추가한 명령어에는 이미 View 때문에 class를 가지고 있다. 이 경우에는 Cog로 어떻게 옮기는지에 대한 방법을 한 번 짚고 넘어가겠다. 

```python
# cogs/interface.py
import discord
from discord import app_commands
from discord.ext import commands

class ButtonView(discord.ui.View):
    def __init__(self, timeout):
        super().__init__(timeout=timeout)
        self.message = None
        ...

class SelectView(discord.ui.View):
    def __init__(self):
        super().__init__(timeout=None)
        self.message = None
        ...
    
class ActionRowView(discord.ui.View):
    @discord.ui.button(label="버튼 1", row=0, style=discord.ButtonStyle.primary)
    async def first_button_callback(self, interaction, button):
        ...
        
class Interface(commands.Cog):
    def __init__(self, bot):
        self.bot = bot

    @app_commands.command(name='버튼', description="버튼 실험용 명령어")
    async def button(self, interaction: discord.Interaction):
        view = ButtonView(timeout=10.0)
        await interaction.response.send_message(view=view)
        view.message = await interaction.original_response()

    @app_commands.command(name='국적', description="국적을 선택합니다")
    async def country(self, interaction: discord.Interaction):
        view = SelectView()
        await interaction.response.send_message(view=view)
            
    @app_commands.command(name='액션', description="Action Row 데모를 보여줍니다")
    async def country(self, interaction: discord.Interaction):
        view = ActionRowView()
        await interaction.response.send_message(view=view)
        
async def setup(bot):
    await bot.add_cog(Interface(bot))
```

지난 번에 인터페이스 테스트 용으로 만들었던 명령어들을 `cogs/` 폴더 안에 `interface.py` 파일을 새로 만들고 옮겨 넣었다. 코드를 전부 Cog class 안에 넣어도 되지만, 위처럼 View class들은 밖으로 빼주고 명령어들만 Cog 안에 넣어도 정상적으로 인터페이스까지 출력된다. 이 점을 활용해 인터페이스는 별도의 파일에 따로 저장하고 필요할 때 모듈을 불러오는 식으로 세분화할 수 있다.

### 4. 여러 개의 Cog 한 번에 추가하기

앞서 `bot.py`에서 `welcome.py` Cog만 불러왔었지만, 기능이 하나 둘 추가될 때마다 Cog의 갯수도 함께 늘어날 것이다. 이에 대비해 `cogs/` 폴더 안의 Cog들을 전부 불러오도록 코드를 고쳐보자.

```python
# bot.py
async def load_extensions():
    for filename in os.listdir('cogs'):
        if filename.endswith('.py'):
            extension = 'cogs.' + filename[:-3]
            print(f"{extension} 모듈을 불러왔습니다.")
            await bot.load_extension(extension)
```

`cogs/` 폴더 안에 있는 모든 Python 파일을 불러오도록 수정했다.

<img src="/assets/img/discord bot/6_1.png" alt="6_1" style="display: block; margin-left: auto; margin-right: auto; width: 60%;">

모든 Cog가 추가된 것을 터미널에서 확인할 수 있다.

> 폴더 안의 모든 Python 파일에 `setup()` 함수가 없으면 오류가 발생한다.
{: .prompt-warning}

이제 모듈화를 마쳤으니 본격적으로 각각의 기능들을 추가해 넣을 시간이다. 하지만 아직 준비할 것이 한 가지 남아있다. 바로 데이터베이스이다. 다음에는 엑셀을 활용해 데이터베이스를 설정하는 방법에 대해 알아보겠다.

## 부록

### i. 전체 코드
```python
# bot.py
import os, discord
from discord import app_commands
from discord.ext import commands
from dotenv import load_dotenv
from cogs.interface import SelectView

load_dotenv()
TOKEN = os.getenv('BOT_TOKEN')
GUILD = int(os.getenv('GUILD_ID'))
CHANNEL = int(os.getenv('CHANNEL_ID'))
ADMIN = int(os.getenv('ADMIN_ID'))
welcome_channel = {GUILD:CHANNEL} # 길드별 환영 메시지 전송 채널

intents = discord.Intents.all()

bot = commands.Bot(command_prefix='$', intents=intents)

async def load_extensions():
    for filename in os.listdir('cogs'):
        if filename.endswith('.py'):
            extension = 'cogs.' + filename[:-3]
            print(f"{extension} 모듈을 불러왔습니다.")
            await bot.load_extension(extension)

@bot.event
async def on_ready():
    bot.add_view(SelectView())
    guild = discord.utils.find(lambda g: g.id == GUILD, bot.guilds)
    print(
        f"{bot.user}(으)로 접속했습니다.\n"
        f"접속 길드: {guild.name} (ID: {guild.id})"
    )

@bot.event
async def setup_hook():
    await load_extensions()
    await bot.tree.sync() # tree 동기화

@bot.tree.command(name='곱하기', description="숫자 두 개를 곱합니다")
@app_commands.describe(정수1="첫 번째 정수", 정수2="두 번째 정수")
async def multiply(interaction: discord.Interaction, 정수1: int, 정수2: int):
    product = 정수1 * 정수2
    await interaction.response.send_message(f"결과는 {product}입니다.")

@bot.tree.command(name='참가일', description="멤버의 서버 참가 날짜를 알려줍니다")
@app_commands.describe(member="조회할 멤버")
async def joined(interaction: discord.Interaction, member: discord.Member):
    join_date = member.joined_at.strftime("%Y-%m-%d")
    await interaction.response.send_message(f"{member.display_name}님은 {join_date}에 서버에 참가했습니다.")

@bot.tree.context_menu(name="참가일")
async def joined_user_menu(interaction: discord.Interaction, member: discord.Member):
    join_date = member.joined_at.strftime("%Y-%m-%d")
    await interaction.response.send_message(f"{member.display_name}님은 {join_date}에 서버에 참가했습니다.")
    
@bot.tree.context_menu(name="글자수")
async def character_count(interaction: discord.Interaction, message: discord.Message):
    characters = len(message.content)
    characters_no_space = len(message.content.replace(' ', ''))
    await interaction.response.send_message(f"공백 포함 {characters}자, 공백 제외 {characters_no_space}자")

bot.run(TOKEN)
```

```python
# cogs/interface.py
import discord
from discord import app_commands
from discord.ext import commands

class ButtonView(discord.ui.View):
    def __init__(self, timeout):
        super().__init__(timeout=timeout)
        self.message = None
        self.button_pressed = False

    async def on_timeout(self):
        if not self.button_pressed:
            for child in self.children:
                if isinstance(child, discord.ui.Button):
                    child.disabled = True
                    child.label = "실패!"
                    child.style = discord.ButtonStyle.danger
        await self.message.edit(view=self)
        
    @discord.ui.button(label="10초 안에 누르세요!", style=discord.ButtonStyle.primary)
    async def button_response(self, interaction: discord.Interaction, button: discord.ui.Button):
        self.button_pressed = True
        button.disabled = True
        button.label = "성공!"
        button.style = discord.ButtonStyle.success
        await interaction.response.edit_message(view=self)

class SelectView(discord.ui.View):
    def __init__(self):
        super().__init__(timeout=None)
        self.message = None
        
    @discord.ui.select(
        custom_id='select_view',
        placeholder="국적을 선택하세요",
        min_values=1, # 골라야 할 최소 갯수
        max_values=1, # 고를 수 있는 최대 갯수
        options=[
            discord.SelectOption(
                label="대한민국",
                description="대한민국 국민입니다.",
                emoji='🇰🇷'
            ),
            discord.SelectOption(
                label="미국",
                description="미국 국민입니다.",
                emoji='🇺🇸'
            ),
            discord.SelectOption(
                label="일본",
                description="일본 국민입니다.",
                emoji='🇯🇵'
            )
        ]
    )
    async def select_response(self, interaction: discord.Interaction, select: discord.ui.Select):
        await interaction.response.edit_message(content=f"{select.values[0]} 국적을 선택하셨습니다.")
    
class ActionRowView(discord.ui.View):
    @discord.ui.button(label="버튼 1", row=0, style=discord.ButtonStyle.primary)
    async def first_button_callback(self, interaction, button):
        await interaction.response.send_message("간지러워요!")

    @discord.ui.button(label="버튼 2", row=0, style=discord.ButtonStyle.primary)
    async def second_button_callback(self, interaction, button):
        await interaction.response.send_message("간지러워요!")
    
    @discord.ui.button(label="버튼 3", row=2, style=discord.ButtonStyle.secondary)
    async def third_button_callback(self, interaction, button):
        await interaction.response.send_message("간지러워요!")
    
    @discord.ui.select(
        placeholder="저는 드롭다운 메뉴에요",
        row=1,
        options=[
            discord.SelectOption(label="1"),
            discord.SelectOption(label="2"),
            discord.SelectOption(label="3")
        ]
    )
    async def select_callback(self, interaction, select):
        await interaction.response.send_message(f"숫자 {select.values[0]}번을 골랐어요.")
        
class Interface(commands.Cog):
    def __init__(self, bot):
        self.bot = bot

    @app_commands.command(name='버튼', description="버튼 실험용 명령어")
    async def button(self, interaction: discord.Interaction):
        view = ButtonView(timeout=10.0)
        await interaction.response.send_message(view=view)
        view.message = await interaction.original_response()

    @app_commands.command(name='국적', description="국적을 선택합니다")
    async def country(self, interaction: discord.Interaction):
        view = SelectView()
        await interaction.response.send_message(view=view)
            
    @app_commands.command(name='액션', description="Action Row 데모를 보여줍니다")
    async def country(self, interaction: discord.Interaction):
        view = ActionRowView()
        await interaction.response.send_message(view=view)
        
async def setup(bot):
    await bot.add_cog(Interface(bot))
```

```python
# cogs/welcome.py
import discord
from discord import app_commands
from discord.ext import commands
from datetime import datetime

class Welcome(commands.Cog):
    def __init__(self, bot):
        self.bot = bot
        
    @commands.Cog.listener()
    async def on_member_join(self, member):
        channel = member.guild.system_channel
        if channel is not None:
            await channel.send(f"{member.display_name}님이 서버에 참가하셨습니다.")
    
    @app_commands.command(name='hello', description="인사를 합니다")
    async def hello(self, interaction: discord.Interaction):
        embed = discord.Embed(
            title=":raised_hands: 반갑습니다!",
            description="서버에 오신 것을 환영합니다.",
            color=discord.Color.gold(),
            timestamp=datetime.now(),
            url='https://sunwoo-j.github.io/'
        )
        embed.add_field(name="동해물과 백두산이", value="마르고 닳도록 하느님이 보우하사 우리나라 만세", inline=False)

        embed.add_field(name="무궁화 삼천리", value="화려강산", inline=True)
        embed.add_field(name="대한사람", value="대한으로", inline=True)
        embed.add_field(name="길이 보전하세", value="(간주)", inline=True)
        
        file = discord.File('./icon.gif')
        
        embed.set_author(name="디스코드 봇 DIY", icon_url='attachment://icon.gif')
        embed.set_thumbnail(url='https://picsum.photos/100/100')
        embed.set_field_at
        embed.set_image(url='https://picsum.photos/600/400')
        embed.set_footer(text="Footer가 들어가는 공간", icon_url='attachment://icon.gif')
    
        await interaction.response.send_message("안녕하세요", embed=embed, file=file)
    
async def setup(bot):
    await bot.add_cog(Welcome(bot))
```

