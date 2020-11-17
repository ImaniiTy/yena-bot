## About
-
## ⚙️Installation
-
## Requirements

1- Discord Bot Token Guide
2- Node.js v12.0.0 or newer

## Required modules

```
"@discordjs/opus": "^0.3.2",
"discord.js": "^12.3.1",
"ytdl-core-discord": "^1.2.3"
```

## Commands

| Command | aliases | |
| ------- | ------- | ------- |
| ping |  | Shows the latency of the bot. |
| help | h | Shows the help menu. |
| setup |  | Setup the unique songrequest channel. |
| radio | rd | List of Radios. |
| radio <kpop/jpop>| rd | Starts radio. |
| prefix |  | Show the current prefix. |
| prefix <new prefix> |  | Set a new prefix. |
| queuelimit |  | Show the song limit for the queue. |
| queuelimit | <limit> | Set the song limit for the queue. |

| lyrics | lyr | Shows lyrics for the currently playing song. |

| Command | aliases | |
| ------- | ------- | ------- |
| play <song name/url> | p | Plays a song. |

| playlist |  | Play your saved default playlist. |
| playlist list |  | List your saved playlists. |
| playlist show <playlist name> [page number] | | Show the songs within the provided playlist. |
| playlist song save <url> [playlist name] | | Save a song to your default or provided playlist |
| playlist song delete <songId> [playlist name] | | Delete a song from your default or provided playlist |

| Command | aliases | |
| ------- | ------- | ------- |
| queue | q \| list | Shows the queue. |
| search <song name> | | Searches and lets you choose a song. |

| songinfo | song | Shows details of the song currently being played. |
| songinfo <song number> | | Shows the detail of a specific song in the queue. |
| voteskip | vs | Lets you vote for skipping the current track. |

| Command | aliases | |
| ------- | ------- | ------- |
| clear | c \| empty | Clears the current queue. |

| loop |  | Cycles through all three loop modes (queue, song, off). |
| loop queue |  | Loop the queue. |
| loop song |  | Loop the current playing song. |
| loop off |  | Turn looping off |
| move <song number> | mv | Move the selected song to the top of the queue. |
| move <from> <to> |  | Move the selected song to the provided position. |
| move swap <from> <to> |  | Swap track positions in the queue. |
| move last |  | Move the last track in the queue to the top. |

| Command | aliases | |
| ------- | ------- | ------- |
| pause | break | Pauses the current playing song. |
| resume | continue | Resumes the current paused song. |

| remove <song number> | rm \| del \| delete | Remove a specific song from the queue. |
| remove cleanup |  | Removes songs from users which left the voice channel. |
| remove doubles |  | Remove duplicate songs from the queue. |
| remove range <from> <to> |  | Remove a range of tracks from the queue. |
| replay | rp \| restart | Replay the current song. |



| Command | aliases | |
| ------- | ------- | ------- |
| seek mm:ss |  | Seeks to a specific position in the current song. |
| shuffle | sh | Shuffle the queue. |
| skip | next | Lets you skip the current song. |
| skip <trackNumber> |  | Skips to a specific track in the queue. |
| stop | leave\ dc \| disconnect | Stops the player and clear the queue. |