# HackVCR protocol

## Introduction

HackVCR uses a protocol reminiscent of SMTP. It is designed to be lightweight yet readable, and runs over a Unix socket.

## Connecting

By default HackVCR writes its control socket to `/tmp/$uid-hackvcr.sock`.

## Syntax

All protocol commands are on their own line (i.e. preceded by a newline), in uppercase, and followed by a newline.

## Commands

`HACKVCR`: sent by the server to denote the beginning of the protocol dialogue.

`VERSION version`: sent by the server to inform the client of the daemon version.

`CAPABILITY`: sent by the server and the client to inform the receiver what capabilities the sender supports.

`END`: sent by the server and the client to denote the end of a protocol section, such as the initial capability handshake or a data section.

`READY`: sent by the server to denote that it is ready to receive data from the client.

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
