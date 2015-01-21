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

## Release and sign
1. run `gulp release-android -p <keystore password>`
2. The apk file is at `platforms/android/ant-build/cgb.apk`

## Background/Streaming Audio for iOS
1. (optional) add the supported modes in `<Projectname>-info.plist` (in this case, `Cell Group Book-info.plist`):
```
<key>UIBackgroundModes</key>
<array>
	<string>audio</string>
</array>
```
2. import AVFoundation into `AppDelegate.m` `#import <AVFoundation/AVFoundation.h>`

3. add the following to `application:(UIApplication*)application didFinishLaunchingWithOptions:(NSDictionary*)launchOptions`

```objective-c
AVAudioSession *audioSession = [AVAudioSession sharedInstance];
BOOL ok;
NSError *setCategoryError = nil;
ok = [audioSession setCategory:AVAudioSessionCategoryPlayback error:&setCategoryError];
```

*It is also important to note that background audio does* **not** *work in the iOS Simulator...* **only** *on an actual device*

## Xcode adjustment
- make sure Target Membership of .m files in Plugins folder are checked
- set `Enable Foundation Assertionss` in `Apple LLVM 6.0 - Preprocessing` in Build Settings to No
