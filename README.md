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
    2. run `gulp compile` to compile js, css, imgages and fonts
3. run `gulp init-android` to install Cordova platform and plugins
4. run `gulp build-android` to build
 
## Developing
- developing using browser
    1. run `gulp watch` to monitor file changes and re-compile automatically
- developing using emulator or device
    1. run `gulp run-android` to run on device/emulator

## release and sign
1. run `gulp release-android -p <keystore password>`
2. The apk file is in `platforms/android/ant-build/cgb.apk`

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