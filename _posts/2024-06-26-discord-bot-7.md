---
title: 디스코드 봇 DIY - 7. SQLite로 데이터베이스 구축하기
date: 2024-07-13 17:12:21 +/-TTTT
last_modified_at: 2024-07-13 17:12:21 +/-TTTT
categories: [Python, discord.py]
tags: [python, discord, bot, database, sql, sqlite]
description: SQLite로 데이터 저장하고 불러오기
---

> 이 글에서 다루는 내용
> - SQLite로 새 데이터베이스 생성하기
> - 데이터베이스에 정보 기록하기
> - 데이터베이스에서 정보 불러오기

## 데이터베이스의 중요성

디스코드 봇 제작 중 **데이터베이스(Database)**를 구축하는 것은 매우 중요한 단계이다. 데이터베이스는 봇이 정보를 체계적으로 저장하고, 불러오고, 관리할 수 있게 함으로써 여러 방면에서 도움이 된다. 아래에 데이터베이스를 사용할 때의 장점을 몇 가지 나열해 보았다.

1. **데이터 지속성**<br>
디스코드 봇이 종료되거나 재시작될 때 메모리에 저장된 모든 데이터는 사라진다. 그러나 데이터베이스를 사용하면 봇이 중단되더라도 데이터는 **안전하게 저장되어 유지**되기에 사용자 정보와 통계 데이터를 잃지 않고 유지할 수 있다.

2. **효율적인 데이터 관리**<br>
데이터베이스는 데이터를 **구조화**하여 저장하고, 필요한 데이터를 효율적으로 검색할 수 있게 한다. 이는 봇이 대량의 데이터를 빠르고 효율적으로 처리할 수 있게 해주며, 봇의 성능을 향상할 수 있다.

3. **데이터 무결성과 정합성**<br>
여러 사용자와의 상호 작용에서 모든 사용자에게 **정확**하면서도 **항상 동일한** 데이터를 제공하는 것은 매우 중요하다. 데이터베이스는 **트랜잭션(Transaction)** 기능을 통해 데이터의 무결성을 보장하고, 동시다발적인 데이터 수정에도 정합성을 유지할 수 있게 한다.

4. **확장성**<br>
봇이 성장하면서 새 기능들이 추가되면, 기록해야 할 데이터의 종류도 함께 늘어난다. 데이터베이스는 확장 가능한 방법으로 데이터를 저장할 수 있도록 도와준다.

5. **고급 기능 구현**<br>
랭킹 시스템과 사용자 통계, 사용자 맞춤형 설정 등 고급 기능을 구현하기 위해서는 데이터베이스가 필수적이다. 데이터베이스는 복잡한 **쿼리(Query)**와 분석을 가능하게 하여, 봇이 다양한 고급 기능을 제공할 수 있게 한다.

결론적으로, 디스코드 봇을 만들면서 데이터베이스를 두는 것은 봇의 기능성을 극대화하기 위한 매우 중요한 단계이다. 데이터베이스를 적절하게 설정하는 것은 봇의 안정적이고 효율적인 작동을 가능케 해준다.

## SQLite 개발 환경 구축

**SQLite**는 경량의 **관계형 데이터베이스 관리 시스템(RDBMS)**이다. 서버에 의존하지 않고 **단일 파일**로 데이터베이스를 저장하며, 매우 간편하게 설정할 수 있어 봇 개발의 초기 단계에서 사용하기 적합하다. 추후 디스코드 봇의 사용량이 증가하고 데이터가 복잡해지면 SQLite의 한계에 도달할 수 있다. 이때는 더욱 강력한 **PostgreSQL**로 전환할 생각이다.

간단하게 사용할 데이터베이스로 엑셀을 사용할 수도 있지만, 엑셀은 데이터가 쌓일수록 성능이 저하되고 무엇보다 데이터를 쓰는 중에 실시간으로 파일을 열어보지 못한다는 치명적인 단점이 있다.

### 1. sqlite3 모듈 설치하기

Python 개발 환경에서 SQLite를 활용하려면 `sqlite3` 모듈을 사용해야 한다. 

```bash
pip install -U sqlite3
```

`sqlite3`은 **Python Standard Library**에 포함되어 있어 Python과 함께 기본으로 설치되지만, 문제가 있으면 위 명령을 통해 설치 및 업데이트를 진행하면 된다.

> `sqlite3`의 자세한 사용법은 [**공식 문서**](https://docs.python.org/3/library/sqlite3.html)에서 확인할 수 있다.
{: .prompt-info}

### 2. DB Browser for SQLite 설치하기

**DB Browser for SQLite**는 SQLite로 작성된 `.db`나 `.sqlite` 파일을 볼 수 있는 **GUI**를 제공하는 프로그램으로, 프로그램을 통해 직접 데이터베이스를 수정할 수도 있다. 

윈도우 11 사용자라면 **아래 링크**를 통해 64비트용 설치 프로그램을 받으면 되고, 아니면 [다운로드 페이지](https://sqlitebrowser.org/dl/)에서 본인의 운영 체제에 맞게 파일을 받으면 된다.

- [*DB Browser for SQLite - Standard installer for 64-bit Windows*](https://download.sqlitebrowser.org/DB.Browser.for.SQLite-3.12.2-win64.msi)

![](/assets/img/discord%20bot/7_1.png)

설치 후 프로그램을 열면 이런 모습이다. 프로그램의 인터페이스에서 손수 새로운 데이터베이스를 만들 수 있지만, 코드를 통해서 데이터베이스가 있는지 확인하고 없다면 자동으로 새로 생성하는 절차를 밟게 할 것이다.

## 데이터베이스 활용

첫 번째로 생성할 데이터베이스는 경험치와 잔액 등 **봇이 제공하는 콘텐츠**와 관련된 사용자의 정보를 추적하고 기록하는 데 사용할 생각이다. 

다만, **동의 없이** 모든 사용자의 정보를 수집하는 것은 문제가 될 여지가 있다. 그렇기 때문에 회원 가입으로 동의를 얻은 사용자의 정보만 데이터베이스에 기록할 것이며, 앞으로 글에서 디스코드 사용자 중 봇에 사용자 등록을 완료한 사용자는 **플레이어**로 구분해서 지칭하도록 하겠다.

### 1. 데이터베이스 생성하기

우선, 데이터베이스와 관련된 기능을 분류해 관리할 수 있도록 `bot.py`가 있는 메인 디렉토리에 `db/` 폴더를 만들고 그 안에 `db.py` 파일을 새로 만들었다. 또한, 데이터베이스 파일이 다른 파일들과 섞이지 않도록 파일을 보관할 수 있는 `data/` 폴더도 따로 추가했다.

```tree
📦Discord Bot
 ┣ 📂cogs
 ┃ ┣ 📜interface.py
 ┃ ┗ 📜welcome.py
 ┣ 📂data
 ┣ 📂db
 ┃ ┗ 📜db.py
 ┣ 📜.env
 ┗ 📜bot.py
```

`sqlite3`로 작업을 하기 위해서는 데이터베이스를 만들고 해당 데이터베이스와 **연결을 생성**해야 한다. 

```python
# db/db.py
import sqlite3, os.path

DB_PATH = 'data/database.db'
BUILD_PATH = 'data/build.sql'
```

`db.py`에서 `sqlite3`을 import하고 `DB_PATH`와 `BUILD_PATH`에 파일 경로를 지정해 주었다. `DB_PATH`는 **데이터베이스 파일**의 경로이며, `BUILD_PATH`는 데이터베이스 생성을 위한 스크립트를 담은 **빌드 파일**의 경로이다. 빌드 파일은 아래서 작성할 텐데, 데이터베이스 파일은 따로 만들지 않아도 된다. 

```python
# db/db.py
...
con = sqlite3.connect(DB_PATH)
cur = con.cursor()
```

`con = sqlite3.connect(DB_PATH)`로 `DB_PATH`에 위치한 데이터베이스 파일과 연결을 생성하여 `con` 변수에 할당했으며, `DB_PATH`에 파일이 존재하지 않는다면 파일 이름에 맞게 **새로운 파일**을 생성한다. 

다음으로 `cur`에 **커서(Cursor)**를 지정했는데, 커서는 SQL 명령을 처리한 결괏값을 저장하는 **임시 메모리**이다. `sqlite3`에서 데이터베이스의 데이터를 불러오거나 수정하려면 커서가 꼭 필요하다.

이제 함수를 통해 데이터베이스의 구조를 정의하고 초기 설정을 구현해 보겠다.

```python
# db/db.py
...
def with_commit(func):
    def inner(*args, **kwargs):
        result = func(*args, **kwargs)
        commit()
        return result
    return inner

@with_commit
def build():
    if os.path.isfile(BUILD_PATH):
        scriptexec(BUILD_PATH)

def commit():
    con.commit()

def scriptexec(path):
    with open(path, 'r', encoding='utf-8') as script:
        cur.executescript(script.read())
```

먼저 `commit()` 함수는 데이터베이스 연결(`con`)에 대해 `commit()`을 호출하는데, 이는 데이터베이스에 변경 사항을 **영구적으로 저장**하는 역할을 한다. 

> `commit`을 하지 않은 채로 **봇 실행을 종료**하면 변동된 데이터가 적용되지 않고 **전부 잃게 된다**.
{: .prompt-warning}

또한 코드에서 `with_commit`라는 데코레이터를 정의해 주었다. 데이터베이스를 수정하는 함수를 호출할 때 이 데코레이터를 써주면 `commit()`을 불러 작업 후 변경 사항을 **자동으로 저장**해 준다. 나중에 코딩하다가 `commit()` 호출을 잊어버리는 실수를 미리 방지할 수 있다.

`build()` 함수는 본격적으로 데이터베이스의 **초기 구조**를 설정하는 역할을 한다. `BUILD_PATH`에 지정된 SQL 스크립트 파일이 존재하는지 확인하고, 존재한다면 `scriptexec()` 함수를 사용해 해당 스크립트를 실행한다. 아직 해당 경로에 파일을 만들지 않았으므로 `data/` 폴더 안에 `build.sql` 파일을 새로 만들어 주자.

```tree
📦Discord Bot
 ┣ 📂cogs
 ┃ ┗ ...
 ┣ 📂data
 ┃ ┗ 📜build.sql
 ┣ 📂db
 ┃ ┗ ...
 ┗ ...
```

생성한 후에 `build.sql` 안에 아래와 같은 SQL 스크립트를 추가했다.

```sql
-- data/build.sql
CREATE TABLE IF NOT EXISTS player (
    user_id integer PRIMARY KEY,
    join_date text,
    balance integer DEFAULT 10000,
    win_count integer DEFAULT 0,
    loss_count integer DEFAULT 0,
    exp integer DEFAULT 0,
    lvl integer DEFAULT 1
);
```

이 스크립트를 실행하면 `player`라는 새로운 테이블을 생성한다. `CREATE TABLE IF NOT EXISTS` 구문은 해당 테이블이 이미 존재하지 않을 경우에만 새로 생성하도록 한다. `player` 테이블을 정리하면 다음과 같다.

| 칼럼         | 데이터 타입 | 설명                             |
| :----------- | :---------- | :------------------------------- |
| `user_id`    | integer     | 플레이어 고유 번호 (PRIMARY KEY) |
| `join_date`  | text        | 플레이어 등록 일시               |
| `balance`    | integer     | 현재 보유액                      |
| `win_count`  | integer     | 도박 승리 횟수                   |
| `loss_count` | integer     | 도박 패배 횟수                   |
| `exp`        | integer     | 경험치                           |
| `lvl`        | integer     | 레벨                             |

`user_id`는 **PRIMARY KEY**로 지정되어 있는데, 데이터의 키 역할을 한다는 의미이다. 데이터를 구분하는 키 역할을 하므로 데이터 간 `user_id`는 같은 값을 가질 수 없으며 필수로 입력되어야 하는 항목이다.

`join_date`는 플레이어가 등록을 한 시간을 기록하기 위해 만든 칼럼으로, **text**는 string처럼 문자열 데이터가 저장된다.  

나머지 칼럼들은 **DEFAULT**가 설정되어 있는데, 새로운 데이터를 추가할 때 별도로 필드의 값이 설정되지 않았을 경우에 **초깃값을 설정**한다. `balance`에 `DEFAULT 10000`을 추가했기 때문에 회원 가입을 하면 초기 자금을 10,000만큼 얻게 된다.

스크립트와 함수를 추가했지만, 아직 호출하는 코드는 작성하지 않았는데, `db/` 폴더 안에 `__init__.py` 파일을 추가해서 해결할 것이다.

> `__init__.py` 파일은 해당 **패키지를 구성하는 모듈**이 import될 때마다 실행된다.
{: .prompt-info}

```python
# db/__init__.py
from . import db

db.build()
```

이러면 데이터베이스 관련 작업을 하기 전 `build()` 함수를 통해 `build.sql`에 작성한 스크립트가 실행되며 `player` 테이블이 만들어지게 된다.

![](/assets/img/discord%20bot/7_2.png)

봇을 실행하면 `data/` 폴더 안에 `database.db` 파일이 생성된 것을 확인할 수 있다.

![](/assets/img/discord%20bot/7_3.png)

파일을 아까 설치한 DB Browser 프로그램으로 열면 `player` 테이블과 칼럼들 목록이 보인다.

### 2. 데이터 추가하기

테이블을 생성했으므로 이제 테이블에 데이터를 추가할 차례다.

```python
# db/db.py
...
@with_commit
def execute(command, values):
    cur.execute(command, values)
    return cur.rowcount
```

`execute()` 함수는 **SQL 명령을 실행**하는 일반적인 함수이다. 이 함수를 활용해 데이터를 추가하거나 수정할 수 있다. `cur.rowcount`는 명령에 영향을 받은 행의 개수를 반환하는데, 나중에 실제로 변화가 이루어졌는지 확인하는 데 유용하다.

`cogs/` 폴더 안에 플레이어 관련 작업을 수행할 `player` 모듈을 만들어 플레이어를 등록하는 명령어를 만들어 보겠다.

```python
# cogs/player.py
import discord, sqlite3
from discord import app_commands
from discord.ext import commands
from db import db

class Player(commands.Cog):
    def __init__(self, bot):
        self.bot = bot
        
    @app_commands.command(name='플레이어등록', description="본인을 플레이어로 등록합니다.")
    async def player_register(self, interaction: discord.Interaction):
        user_id = interaction.user.id
        join_date = datetime.now(timezone.utc).strftime('%Y-%m-%d %H:%M:%S') # UTC 시간 불러오기
        try: # 플레이어 등록 시도
            db.execute("INSERT INTO player (user_id, join_date) VALUES (?, ?)", user_id, join_date)
            await interaction.response.send_message("플레이어로 등록되었습니다.")
        except sqlite3.IntegrityError as e:
            if "UNIQUE constraint failed" in str(e):
                await interaction.response.send_message("이미 등록된 플레이어입니다.")
            else:
                await interaction.response.send_message(f"등록 중에 오류가 발생했습니다: {e}")
        
async def setup(bot):
    await bot.add_cog(Player(bot))
```

`"INSERT INTO player ..."` 구문을 `execute()`로 실행하면 `player` 테이블에서 `user_id`와 `join_date` 칼럼에 주어진 값을 지정하여 **새 레코드를 생성**한다. `user_id`에는 중복되지 않는 디스코드 사용자 고유 ID를 지정하고 `join_date`에는 현재 시간을 넣어준다.

> `%s` 대신에 `?`를 사용하는 이유는 [**인젝션 공격**](https://namu.wiki/w/SQL%20injection)을 방지하기 위해서이다.
{: .prompt-info}

더불어 이미 등록된 사용자라면 등록하지 못하도록 중복 오류에 대한 error handling을 설정했다. `"INSERT INTO"` 대신에 `"INSERT IGNORE INTO"`를 쓰면 알아서 **Primary Key가 중복되는 데이터**는 등록하지 않지만, 따로 exception을 부르지는 않는다. 나는 메시지를 보내고 싶으므로 일부러 오류를 발생시키는 방법을 사용했다.

<img src="/assets/img/discord bot/7_4.png" alt="7_4" style="display: block; margin-left: auto; margin-right: auto; width: 60%;">

봇을 실행하면 명령어가 정상적으로 작동한다. 플레이어를 등록한 상태에서 다시 명령어를 사용하면 중복된 키를 확인하고 오류 메시지를 출력한다.

![](/assets/img/discord%20bot/7_5.png)

DB Browser에서 `player` 테이블을 선택하고 우클릭 메뉴에서 <kbd>Browse Table</kbd>을 선택하면 테이블을 보는 화면으로 넘어갈 수 있다. 위쪽의 <kbd>Browse Data</kbd> 탭을 선택해도 된다.

![](/assets/img/discord%20bot/7_6.png)

방금 플레이어로 추가한 내 디스코드 계정의 ID가 등록 시간과 함께 등록되어 있는 것을 확인할 수 있다.

> `commit()`이 호출되도록 설정하지 않았다면 DB Browser에 등록한 정보가 보이지 않는다.
{: .prompt-warning}

### 3. 데이터 조회하기

데이터를 추가했으면 이제 활용을 해볼 차례이다. 우선 `db.py`에 함수를 몇 가지 더 추가하도록 하겠다.

```python
# db/db.py
...
def field(command, *values):
    cur.execute(command, values)
    fetch = cur.fetchone()
    return fetch[0] if fetch else None

def record(command, *values):
    cur.execute(command, values)
    return cur.fetchone()
```

이 두 개의 함수는 데이터베이스에서 정보를 조회하는 데 사용된다. `field()` 함수는 단일 필드 값을 반환하도록 만들어졌으며, **하나의 칼럼 값**을 조회할 때 유용하다. 반면에 `record()` 함수는 **레코드 전체**를 반환하기에 한 플레이어에 대한 모든 정보를 가져올 때 유용하다.

```python
# cogs/player.py
    ...
    @app_commands.command(name='잔액', description="현재 보유 중인 금액을 확인합니다.")
        async def get_balance(self, interaction: discord.Interaction):
            user_id = interaction.user.id
            balance = db.field("SELECT balance FROM player WHERE user_id = ?", user_id) or None

            if balance:
                await interaction.response.send_message(f"현재 잔액은 ${balance:,}입니다.")
            else:
                await interaction.response.send_message("불러올 수 없습니다.")
```

`player.py`에 플레이어 잔액을 확인할 수 있는 명령어를 추가했다. `balance` 칼럼 하나만 불러오면 되기 때문에 `field()` 함수를 활용하여 `user_id`를 가진 레코드를 찾아 값을 불러온다.

```python
# cogs/player.py
    ...
    @app_commands.command(description="플레이어의 정보를 조회합니다.")
    @app_commands.describe(player="조회할 플레이어")
    @app_commands.rename(player='플레이어')
    async def 플레이어정보(self, interaction: discord.Interaction, player: discord.User):
        user_id = player.id
        player_info = db.record("SELECT join_date, win_count, loss_count, exp, lvl FROM player WHERE user_id = ?", user_id)
        join_date, win_count, loss_count, exp, lvl = player_info or (None, None, None, None, None)

        if player_info:
            embed = discord.Embed(
                title=f"{player.display_name}님의 정보",
                color=discord.Color.blue()
            )
            embed.add_field(name="가입일", value=join_date, inline=False)
            embed.add_field(name="도박 전적", value=f"{win_count} 승 / {loss_count} 패", inline=False)
            embed.add_field(name="레벨 / 경험치", value=f"{lvl} 레벨 / {exp}", inline=False)
            await interaction.response.send_message(embed=embed)
        else:
            await interaction.response.send_message("불러올 수 없습니다.")
```

이번에는 `record()` 함수를 활용하여 여러 개의 필드를 동시에 가져오는 명령어를 만들었다. 

> `@app_commands.rename()`을 사용하면 UI에 보이는 명령어 argument의 이름을 변경할 수 있다.
{: .prompt-info}

<img src="/assets/img/discord bot/7_7.png" alt="7_7" style="display: block; margin-left: auto; margin-right: auto; width: 60%;">

명령어를 입력하면 argument로 입력한 플레이어의 `user_id`를 `player` 테이블에서 대조하여 상응하는 레코드를 불러온 뒤에 잔액을 제외한 플레이어의 정보를 임베드로 보여준다.

### 4. 데이터 수정하기

데이터를 수정하는 것은 앞서서 본 `"SELECT ... FROM ... WHERE ..."` 구문의 형식과 비슷하게 `"UPDATE ... SET ... WHERE ..."`로 할 수 있다. 예시로 플레이어의 잔액을 변경하는 명령어를 만들어 보겠다.

```python
# cogs/player.py
    ...
    @app_commands.command(description="플레이어의 잔액을 변경합니다.")
    @app_commands.describe(player="변경할 플레이어", new_balance="설정할 잔액")
    @app_commands.rename(player='플레이어', new_balance='신규잔액')
    async def 잔액변경(self, interaction: discord.Interaction, player: discord.User, new_balance: int):
        if interaction.user.guild_permissions.administrator:
            user_id = player.id
            affected_rows = db.execute("UPDATE player SET balance = ? WHERE user_id = ?", new_balance, user_id)

            if affected_rows > 0:
                await interaction.response.send_message(
                    f"{player.display_name}님의 잔액을 ${new_balance:,}로 변경했습니다."
                )
            else:
                await interaction.response.send_message("플레이어로 등록되지 않은 사용자입니다.")
        else:
            await interaction.response.send_message("권한이 없습니다.")
```

관리자 권한이 있는 경우에 플레이어의 잔액을 변경하는 명령어다. `affected_rows`가 0이라면 변경이 이루어진 행이 없고 주어진 `user_id`를 가진 플레이어가 존재하지 않는다는 뜻이므로 그에 맞는 출력을 해주었다.

<img src="/assets/img/discord bot/7_9.png" alt="7_9" style="display: block; margin-left: auto; margin-right: auto; width: 60%;">

플레이어가 존재한다면 잔액이 입력한 금액으로 변경되고 그렇지 않다면 아래처럼 메시지가 출력된다.

![](/assets/img/discord%20bot/7_10.png)

DB Browser에서도 플레이어의 `balance` 항목이 설정한 금액인 33333으로 변경된 것을 확인할 수 있다. 

> 변경된 값이 확인되지 않는다면 테이블 위 툴바에서 <kbd>🔄</kbd>을 눌러 **새로고침**부터 시도해 보자.
{: .prompt-info}

### 5. 데이터 삭제하기

다음으로는 데이터를 삭제하는 방법에 대해 알아보자. 레코드 삭제는 `"DELETE FROM ... WHERE ..."` 구문을 실행해 진행할 수 있다. 아래는 플레이어 탈퇴를 수행하는 명령어이다.

```python
# cogs/player.py
    ...
    @app_commands.command(name='플레이어탈퇴', description="플레이어 탈퇴를 진행합니다.")
    async def player_delete(self, interaction: discord.Interaction):
        user_id = interaction.user.id
        affected_rows = db.execute("DELETE FROM player WHERE user_id = ?", user_id)

        if affected_rows > 0:
            await interaction.response.send_message("플레이어 탈퇴가 완료되었습니다.")
        else:
            await interaction.response.send_message("플레이어로 등록되지 않은 사용자입니다.")
```

<img src="/assets/img/discord bot/7_11.png" alt="7_11" style="display: block; margin-left: auto; margin-right: auto; width: 60%;">

플레이어 잔액을 변경할 때와 마찬가지로 변경된 행이 있다면 탈퇴가 성공한 것으로 간주하고 없다면 존재하지 않는 플레이어로 간주한다.

![](/assets/img/discord%20bot/7_12.png)

플레이어 탈퇴를 진행한 뒤 DB Browser로 돌아가면 테이블에서 플레이어가 삭제된 것을 확인할 수 있다.

### 6. 기타 데이터베이스 조작법

우리의 경우에는 `@with_commit`을 사용해 `execute()`를 할 때마다 변경 사항이 적용되게 했지만, 수동으로 `commit()`을 추가하는 경우에는 커밋하기 전에 `con.rollback()`을 통해 변경 사항을 전부 되돌려놓을 수 있다.

```python
# db/db.py
...
def close():
    con.close()
```

`close()`는 데이터베이스와의 연결을 끊는 데 사용되는 함수이다. 우리의 경우에는 봇이 동작하고 있는 동안 계속 데이터베이스와 소통해야 하므로 쓸 일이 거의 없기는 하다. 커밋을 하지 않고 `close()`를 한다면 변경 사항이 저장되지 않으니 조심해야 한다.

DB Browser를 활용해서 데이터베이스를 관리할 수도 있다.

![](/assets/img/discord%20bot/7_13.png)

수정하고 싶은 테이블을 선택한 뒤 우클릭 메뉴에서 <kbd>Modify Table</kbd>을 선택하거나 상단 툴바에서 <kbd>Modify Table</kbd>을 클릭하면 테이블의 **기본 정보 및 칼럼을 수정**할 수 있다.

<img src="/assets/img/discord bot/7_14.png" alt="7_14" style="display: block; margin-left: auto; margin-right: auto; width: 60%;">

보이는 것처럼 칼럼의 이름, 타입, Primary Key 여부, 기본값 등을 코드를 만질 필요 없이 바로 수정할 수 있다.

이렇게 디스코드 봇에서 SQLite 데이터베이스를 활용하는 기본적인 방법에 대해 알아보았다. 기본적인 준비는 모두 끝났으니 다음 글부터는 이렇게 구축한 데이터베이스를 활용하여 본격적으로 콘텐츠를 추가해 볼 차례다. 사용자 경험치 시스템과 도박 및 게임 기능, 서버별 설정 관리 등 데이터베이스를 활용한 다양한 기능들을 만들 수 있을 것이다.

## 부록

### i. 전체 코드

<details>
<summary>코드 보기</summary>
<div markdown="1">

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
    
@bot.command(name='unload')
@commands.is_owner()
async def unload(ctx, extension: str):
    try:
        await bot.unload_extension(f'cogs.{extension}')
        await ctx.send(f'{extension} Cog를 제거했습니다.')
    except Exception as e:
        await ctx.send(f'오류: {e}')

@bot.command(name='load')
@commands.is_owner()
async def unload(ctx, extension: str):
    try:
        await bot.load_extension(f'cogs.{extension}')
        await ctx.send(f'{extension} Cog를 불러왔습니다.')
        await bot.tree.sync()
    except Exception as e:
        await ctx.send(f'오류: {e}')

@bot.command(name='reload')
@commands.is_owner()
async def reload(ctx, extension: str):
    try:
        await bot.reload_extension(f'cogs.{extension}')
        await ctx.send(f'{extension} Cog를 다시 불러왔습니다.')
        await bot.tree.sync()
    except Exception as e:
        await ctx.send(f'오류: {e}')

@bot.tree.command(name='곱하기', description="숫자 두 개를 곱합니다")
@app_commands.describe(정수1="첫 번째 정수", 정수2="두 번째 정수")
async def multiply(interaction: discord.Interaction, 정수1: int, 정수2: int):
    product = 정수1 * 정수2
    await interaction.response.send_message(f"결과는 {product}입니다.")

@bot.tree.command(name='참가일', description="멤버의 서버 참가 날짜를 알려줍니다")
@app_commands.describe(멤버="조회할 멤버")
async def joined(interaction: discord.Interaction, 멤버: discord.Member):
    join_date = 멤버.joined_at.strftime("%Y-%m-%d")
    await interaction.response.send_message(f"{멤버.display_name}님은 {join_date}에 서버에 참가했습니다.")

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
    
    @app_commands.command(name='추가', description="새로운 명령어")
    async def new_command(self, interaction: discord.Interaction):
        await interaction.response.send_message("새로 만들어졌어요.")

async def setup(bot):
    await bot.add_cog(Interface(bot))
    
async def teardown(bot):
    print("몸이 이상해요..")
```

```python
# cogs/player.py
import discord, sqlite3
from discord import app_commands
from discord.ext import commands
from datetime import datetime, timezone
from db import db

class Player(commands.Cog):
    def __init__(self, bot):
        self.bot = bot
        
    @app_commands.command(name='플레이어등록', description="본인을 플레이어로 등록합니다.")
    async def player_register(self, interaction: discord.Interaction):
        user_id = interaction.user.id
        join_date = datetime.now(timezone.utc).strftime('%Y-%m-%d %H:%M:%S')
        try: # 플레이어 등록 시도
            db.execute("INSERT INTO player (user_id, join_date) VALUES (?, ?)", user_id, join_date)
            await interaction.response.send_message("플레이어로 등록되었습니다.")
        except sqlite3.IntegrityError as e:
            if "UNIQUE constraint failed" in str(e):
                await interaction.response.send_message("이미 등록된 플레이어입니다.")
            else:
                await interaction.response.send_message(f"등록 중에 오류가 발생했습니다: {e}")
                
    @app_commands.command(name='플레이어탈퇴', description="플레이어 탈퇴를 진행합니다.")
    async def player_delete(self, interaction: discord.Interaction):
        user_id = interaction.user.id
        affected_rows = db.execute("DELETE FROM player WHERE user_id = ?", user_id)
        
        if affected_rows > 0:
            await interaction.response.send_message("플레이어 탈퇴가 완료되었습니다.")
        else:
            await interaction.response.send_message("플레이어로 등록되지 않은 사용자입니다.")
                
    @app_commands.command(description="현재 보유 중인 금액을 확인합니다.")
    @app_commands.describe(플레이어="조회할 플레이어")
    async def 잔액(self, interaction: discord.Interaction, 플레이어: discord.User):
        user_id = 플레이어.id
        balance = db.field("SELECT balance FROM player WHERE user_id = ?", user_id) or None

        if balance:
            await interaction.response.send_message(f"현재 잔액은 ${balance:,}입니다.")
        else:
            await interaction.response.send_message("불러올 수 없습니다.")
            
    @app_commands.command(description="플레이어의 정보를 조회합니다.")
    @app_commands.describe(player="조회할 플레이어")
    @app_commands.rename(player='플레이어')
    async def 플레이어정보(self, interaction: discord.Interaction, player: discord.User):
        user_id = player.id
        player_info = db.record("SELECT join_date, win_count, loss_count, exp, lvl FROM player WHERE user_id = ?", user_id)
        join_date, win_count, loss_count, exp, lvl = player_info or (None, None, None, None, None)

        if player_info:
            embed = discord.Embed(
                title=f"{player.display_name}님의 정보",
                color=discord.Color.blue()
            )
            embed.add_field(name="가입일", value=join_date, inline=False)
            embed.add_field(name="도박 전적", value=f"{win_count} 승 / {loss_count} 패", inline=False)
            embed.add_field(name="레벨 / 경험치", value=f"{lvl} 레벨 / {exp}", inline=False)
            await interaction.response.send_message(embed=embed)
        else:
            await interaction.response.send_message("불러올 수 없습니다.")
            
    @app_commands.command(description="플레이어의 잔액을 변경합니다.")
    @app_commands.describe(player="변경할 플레이어", new_balance="설정할 잔액")
    @app_commands.rename(player='플레이어', new_balance='신규잔액')
    async def 잔액변경(self, interaction: discord.Interaction, player: discord.User, new_balance: int):
        if interaction.user.guild_permissions.administrator:
            user_id = player.id
            affected_rows = db.execute("UPDATE player SET balance = ? WHERE user_id = ?", new_balance, user_id)

            if affected_rows > 0:
                await interaction.response.send_message(f"{player.display_name}님의 잔액을 ${new_balance:,}로 변경했습니다.")
            else:
                await interaction.response.send_message("플레이어로 등록되지 않은 사용자입니다.")
        else:
            await interaction.response.send_message("권한이 없습니다.")
        
async def setup(bot):
    await bot.add_cog(Player(bot))
```

```python
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

```sql
-- data/build.sql
CREATE TABLE IF NOT EXISTS player (
    user_id integer PRIMARY KEY,
    join_date text,
    balance integer DEFAULT 10000,
    win_count integer DEFAULT 0,
    loss_count integer DEFAULT 0,
    exp integer DEFAULT 0,
    lvl integer DEFAULT 1
);
```

```python
# db/__init__.py
from . import db

db.build()
```

```python
# db/db.py
import sqlite3, os.path

DB_PATH = './data/database.db'
BUILD_PATH = './data/build.sql'

con = sqlite3.connect(DB_PATH, check_same_thread=False)
cur = con.cursor()

def with_commit(func):
    def inner(*args, **kwargs):
        result = func(*args, **kwargs)
        commit()
        return result
    return inner

@with_commit
def build():
    if os.path.isfile(BUILD_PATH):
        scriptexec(BUILD_PATH)

def commit():
    con.commit()

def close():
    con.close()

def field(command, *values):
    cur.execute(command, values)
    fetch = cur.fetchone()
    return fetch[0] if fetch else None

def record(command, *values):
    cur.execute(command, values)
    return cur.fetchone()

def column(command, *values):
    cur.execute(command, values)
    return [item[0] for item in cur.fetchall()]

@with_commit
def execute(command, *values):
    cur.execute(command, values)
    return cur.rowcount

@with_commit
def scriptexec(path):
    with open(path, 'r', encoding='utf-8') as script:
        cur.executescript(script.read())
```
</div>
</details>

### ii. 폴더 구조

```tree
📦Discord Bot
 ┣ 📂cogs
 ┃ ┣ 📜interface.py
 ┃ ┣ 📜player.py
 ┃ ┗ 📜welcome.py
 ┣ 📂data
 ┃ ┣ 📜build.sql
 ┃ ┗ 📜database.db
 ┣ 📂db
 ┃ ┣ 📜__init__.py
 ┃ ┗ 📜db.py
 ┣ 📜.env
 ┣ 📜bot.py
 ┣ 📜icon.gif
 ┗ 📜thumbnail.png
```

### iii. 깃허브 리포지토리

<https://github.com/sunwoo-j/discord-bot-diy>