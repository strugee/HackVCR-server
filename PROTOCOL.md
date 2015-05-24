# HackVCR protocol

## Introduction

HackVCR uses a protocol reminiscent of SMTP. It is designed to be lightweight yet readable, and runs over a Unix socket.

## Connecting

By default HackVCR writes its control socket to `/tmp/$uid-hackvcr.sock`.

You may use any language that supports reading from and writing to Unix sockets. `nc -U` is particularly useful for debugging.

## Syntax

All protocol commands are on their own line (i.e. preceded by a newline), in uppercase, and followed by a newline.

Everything that is not a protocol command is considered data, the interpretation of which depends on the mode of the connection (which can be set using certain commands). If the connection has no mode set, the data is rejected and an `ERROR` command sent to the client.

## Handshake

Until the client performs the handshake, the only commands available to it are `VERSION`, `CAPABILITY` and `END`. Anything else will be responded to with `ERROR`.

1. Server sends `HACKVCR` to denote the beginning of the protocol dialogue.
2. Server sends `VERSION` followed by its version number.
3. Server sends one `CAPABILITY` command for each capability it has.
4. Server sends `END` to end server introduction.
5. Client sends `VERSION` followed by its version number.
6. Client sends one `CAPABILITY` command for each capability it has.
7. Client sends `END` to end client introduction.
8. Server sends `READY` to acknowledge that the handshake is complete and it is ready to receive commands.

## Commands

`HACKVCR`: sent by the server to denote the beginning of the protocol dialogue.

`VERSION version`: sent by the server and the client to inform the receiver of the sender version.

`CAPABILITY`: sent by the server and the client to inform the receiver what capabilities the sender supports.

`END`: sent by the server and the client to denote the end of a protocol section, such as the initial capability handshake or a data section.

`READY`: sent by the server to denote that it is ready to receive data from the client.

`ERROR`: sent by the server if the client sends illegal data.

The presence of certain capabilities may also imply additional available commands.

## Capabilities

`EDITOR_FILE`: the ability to send and receive entire files.

`EDITOR_DIFF`: the ability to send and receive file diffs.

`EDITOR_VIEW`: the ability to send and receive information on what part of files are being shown.

`EDITOR_CURSOR`: the ability to send and receive cursor position information.

`EDITOR_LAYOUT`: the ability to send and receive information about how files are laid out in the editor.

`EDITOR_MULTICURSOR`: the ability to send and receive information about where alternate "deselected" cursors are.

`EDITOR_BORDER`: the ability to send and receive screenshots of the editor border.

`RENDER_SCREENSHOT`: the ability to send and receive screenshots of the running program.

`RENDER_CURSOR`: the ability to send and receive information about the cursor position over the running program.

`RENDER_BORDER_POSITION`: the ability to send and receive information about what regions of the screenshot constitute a border.

`THROTTLE`: the ability for the server to signal that the client should send less frequent updates, or for the client to understand the server's signal.
