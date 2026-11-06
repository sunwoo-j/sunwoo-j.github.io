---
title: Discord Bot DIY — 1. Creating a Discord Bot
date: 2024-05-22 09:31:20 +0900
last_modified_at: 2024-06-25 18:35:34 +0900
categories:
- Python
- discord.py
tags:
- python
- discord
- bot
description: Create a bot, connect it to Discord, and respond to messages with Python.
reviewed_at: 2026-11-06
lang: en
layout: lily-post
original_url: /posts/discord-bot-1/
permalink: /en/posts/discord-bot-1/
comments: true
translation_key: discord-bot-1
previous:
  url: /en/posts/discord-bot-0/
  title: Discord Bot DIY — 0. Concepts and a Development Plan
next:
  url: /en/posts/discord-bot-2/
  title: Discord Bot DIY — 2. Basic Commands
---
> In this entry
> - Creating a Discord bot
> - Adding it to a test server
> - Setting up Python
> - Making the bot respond to messages

## Creating a bot

Before adding features, we need a bot to put them in. Follow these steps to create one.

### 1. Create an application

Open the [Discord Developer Portal](https://discord.com/developers/applications) and sign in. If you do not have an account, create one first.

![1. Create an application — illustration](/assets/img/discord%20bot/1_0.png)

The portal lets you create an application. An application provides the identity, authentication settings, and permissions needed to interact with the Discord API.

![1. Create an application — illustration](/assets/img/discord%20bot/1_1.png)

Choose **New Application** in the upper-right corner.

![1. Create an application — illustration](/assets/img/discord%20bot/1_2.png)

Enter a name and choose **Create**.

![1. Create an application — illustration](/assets/img/discord%20bot/1_3.png)

The application information page lets you change its icon, name, and description. Some application information can appear in installation and authorization screens.

> Programs that interact with Discord’s API use a [Discord application](https://discord.com/developers/docs/game-sdk/applications), including programs other than bots.
{: .prompt-info}

Open **Bot** in the left menu.

![1. Create an application — illustration](/assets/img/discord%20bot/1_4.png)

In the portal shown in May 2024, the application already had a bot. If yours does not, use **Add Bot** when that option is available. Portal screens can change over time.

The bot initially takes its name from the application. **USERNAME**, **ICON**, and **BANNER** control its visible identity. The numeric tag shown in these screenshots was not directly editable.

> Keep the Developer Portal open; we will return to it shortly.
{: .prompt-tip}

Now the bot needs a place to run alongside users.

### 2. Create a test guild

The API calls what Discord users usually call a server a **guild**. This distinguishes a community from the infrastructure that runs Discord itself. In our code, `guild` will refer to one of these communities.

> This series uses **guild** when discussing a Discord community through the API.
{: .prompt-info}

You can invite the bot to an existing guild if you have the required permissions. A dedicated test guild is more convenient, though: testing a bot can generate a lot of messages.

![2. Create a test guild — illustration](/assets/img/discord%20bot/1_5.png)

In the Discord app or [website](https://discord.com/channels/@me), choose the **+** at the bottom of the guild list.

![2. Create a test guild — illustration](/assets/img/discord%20bot/1_6.png)

![2. Create a test guild — illustration](/assets/img/discord%20bot/1_7.png)

Choose **Create My Own**, then **For me and my friends**.

![2. Create a test guild — illustration](/assets/img/discord%20bot/1_8.png)

Give the guild a name and choose **Create**.

![2. Create a test guild — illustration](/assets/img/discord%20bot/1_9.png)

The new guild appears in the left sidebar. We can now add the bot.

### 3. Add the bot to the guild

Bots are installed through an authorization flow using [OAuth2](https://discord.com/developers/docs/topics/oauth2), rather than a regular user invitation.

![3. Add the bot to the guild — illustration](/assets/img/discord%20bot/1_10.png)

Return to the [Developer Portal](https://discord.com/developers/applications) and open **OAuth2**. The **OAuth2 URL Generator** creates an authorization link for the application.

> A scope specifies a kind of access requested by an application. For this example, use the `bot` scope.
{: .prompt-info}

![3. Add the bot to the guild — illustration](/assets/img/discord%20bot/1_11.png)

Select **bot** under **SCOPES** to reveal **BOT PERMISSIONS**. Choose only the permissions needed here: **View Channels**, **Send Messages**, and **Read Message History**. The screenshot shows **Administrator**, which grants all permissions; you do not need to copy that choice.

![3. Add the bot to the guild — illustration](/assets/img/discord%20bot/1_13.png)

Copy the generated URL at the bottom.

![3. Add the bot to the guild — illustration](/assets/img/discord%20bot/1_14.png)

![3. Add the bot to the guild — illustration](/assets/img/discord%20bot/1_15.png)

Open it in a browser, select the test guild, and continue through authorization. A success message confirms that the bot has been added.

![3. Add the bot to the guild — illustration](/assets/img/discord%20bot/1_16.png)

![3. Add the bot to the guild — illustration](/assets/img/discord%20bot/1_17.png)

Discord displays a join message, and the bot appears offline in the member list. It is still an empty shell; next we will give it something to do.

## Starting development in Python

We will use the [`discord.py` library](https://discordpy.readthedocs.io/en/latest/). Its asynchronous API uses coroutines to handle I/O without making every operation block the rest of the bot.

### 1. Install the library

Install `discord.py` with `pip`:

```bash
$ pip install -U discord.py
```

### 2. Connect the bot to Discord

To receive commands and respond, the program must connect to Discord. We will start with [`Client`](https://discordpy.readthedocs.io/en/stable/api.html#clients).

`discord.Client` represents the connection and provides access to Discord’s WebSocket events and API. This example comes from the library’s [quick start](https://discordpy.readthedocs.io/en/latest/quickstart.html#a-minimal-bot).

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

The code creates `client` and registers handlers for the **events** `on_ready()` and `on_message()`. Events represent things that happen, such as receiving a message or creating a channel. `on_ready()` runs when the client is ready to work with Discord; `on_message()` handles messages visible to the bot.

> See the [event reference](https://discordpy.readthedocs.io/en/latest/api.html?#discord-api-events) for other available events.
{: .prompt-info}

Event handlers alone do not identify which bot to run. We also need the bot’s **token**, a secret used to authenticate API access.

![This example requires the 'message_content' intent. — illustration](/assets/img/discord%20bot/1_18.png)

In the portal’s **Bot** tab, choose **Reset Token**.

![This example requires the 'message_content' intent. — illustration](/assets/img/discord%20bot/1_19.png)

![This example requires the 'message_content' intent. — illustration](/assets/img/discord%20bot/1_20.png)

Confirm the reset and complete the requested account verification.

![This example requires the 'message_content' intent. — illustration](/assets/img/discord%20bot/1_21.png)

The newly issued token is shown at creation time. Copy it and store it securely before closing or refreshing the page. If it is lost, reset it again.

> Treat the token like the bot’s password. Never share it or publish it in a repository. If it is exposed, reset it immediately.
{: .prompt-danger}

![This example requires the 'message_content' intent. — illustration](/assets/img/discord%20bot/1_22.png)

[**Intents**](https://discord.com/developers/docs/topics/gateway#gateway-intents) control which event data the bot requests. Privileged intents such as `GUILD_PRESENCES`, `GUILD_MEMBERS`, and `MESSAGE_CONTENT` require additional configuration. For this example, enable **Message Content Intent** and save the change. A later member-join example also needs **Server Members Intent**. See the [official intents guide](https://discordpy.readthedocs.io/en/stable/intents.html).

Larger bots may also require Discord’s approval for privileged intents; check the current verification requirements when expanding beyond a test guild.

```python
# This example requires the 'message_content' intent.

import discord

intents = discord.Intents.default()
intents.message_content = True
...
```

Keep `discord.Intents.default()` and enable `message_content` in code. Both the code and portal settings must match the features being used. For an initial local test, replace `'your token here'` with the token, then move it to an environment variable as described below before sharing any code.

<img src="/assets/img/discord bot/1_23.png" alt="This example requires the 'message_content' intent. — illustration" style="display: block; margin-left: auto; margin-right: auto; width: 80%;">

If the connection succeeds, `on_ready()` prints its log message. Incorrect privileged-intent settings can cause this error:

```terminal
discord.errors.PrivilegedIntentsRequired: Shard ID None is requesting privileged intents that have not been explicitly enabled in the developer portal. It is recommended to go to https://discord.com/developers/applications/ and explicitly enable the privileged intents within your application's page. If this is not possible, then consider disabling the privileged intents instead.
```

> If this appears, check the requested intents in both the code and the Developer Portal.
{: .prompt-warning}

![This example requires the 'message_content' intent. — illustration](/assets/img/discord%20bot/1_24.png)

The bot should now appear **online**. Our empty shell has come to life.

<img src="/assets/img/discord bot/1_25.png" alt="This example requires the 'message_content' intent. — illustration" style="display: block; margin-left: auto; margin-right: auto; width: 60%;">

Messages beginning with `$hello` cause the bot to send the response defined in the handler.

### 3. Use an environment variable

The eventual goal is deployment, so the token should not remain embedded in the source. We will store it in a `.env` file.

```tree
📦Discord Bot
 ┣ 📜.env
 ┗ 📜bot.py
 ```

```text
# .env
BOT_TOKEN={봇 토큰}
```

Create `.env` alongside the Python entry point and set `BOT_TOKEN` to the token. Keep this file out of version control.

```bash
pip install -U python-dotenv
```

Install `python-dotenv` if necessary so Python can read the file.

```python
# This example requires the 'message_content' intent.

import discord
import os
from dotenv import load_dotenv

load_dotenv()

TOKEN = os.getenv('BOT_TOKEN')
...
```

Import the required functions and call `load_dotenv()` to load the file’s values into the environment.

```python
...
client.run(TOKEN)
```

Replace the literal token in `run()` with `BOT_TOKEN`.

The bot currently does little more than respond to a conditional check on a message, but even that makes an otherwise quiet test guild feel less empty. Next we will use `discord.ext.commands` to create actual commands.

## Appendix

### i. Complete code

<details>
<summary>Show code</summary>
<div markdown="1">

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

</div>
</details>

### ii. Folder structure

```tree
📦Discord Bot
 ┣ 📜.env
 ┗ 📜bot.py
```

### iii. GitHub repository

<https://github.com/sunwoo-j/discord-bot-diy>
