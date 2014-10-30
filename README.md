Cell Group Book
=========

## Requirements
- Node.js
- Apache Cordova
- ANT
- Android SDK
- Java

## Set Up Development Environment
After all requirements are met, do following:

1. clone repo
2. install Node.js packages
    1. run `npm install` to install required packages
    2. run `gulp compile` to compile js, css, imgages and fonts
3. run `gulp init-android` to install Android platform and Cordova plugins
4. run `gulp build-android` to build Android project
 
## Developing
- developing using browser
    - run `gulp watch` to monitor file changes and re-compile automatically
- developing using emulator or device
    - run `gulp run-android` to run on device/emulator

## release and sign
1. run `gulp release-android -p <keystore password>`
2. The apk file is at `platforms/android/ant-build/cgb.apk`