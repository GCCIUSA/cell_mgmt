Cell Group Book
=========

## Requirements
- Node.js
- Apache Cordova
- ANT
- Android SDK
- Java

Refer to Cordova Document - Platform Guide for details

## Set Up Development Environment
After all requirements are met, do following:

1. clone repo
2. install Node.js packages
    1. run `npm install` to required packages
    2. run `gulp compile` to compile js, css and fonts
3. install Cordova platform and plugins
    1. run `cordova platform add android` to add Android platform
    2. run `cordova plugin add https://git-wip-us.apache.org/repos/asf/cordova-plugin-dialogs.git` to install Notification plugin
4. run `cordova build android` to build
5. run `cordova run android` to build to device/emulator


## Product Backlog

- create / edit / delete a cell group
- search cell groups
- create / edit / delete members and permissions
- cell group budget management
- things to pray for
- photo management

## Sprints

### Sprint 1
- create / edit / delete a cell group
- create / edit / delete members and permissions

### Sprint 2
- cell group budget management
- things to pray for

### Sprint 3
- photo management

### Sprint 4
- search public cell groups