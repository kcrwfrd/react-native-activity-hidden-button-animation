# `react-native-activity-hidden-button-animation`

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## The bug this project reproduces

https://github.com/user-attachments/assets/5b5bd6b5-1e00-4085-aba4-0cffe72c6bfe

A `TouchableOpacity` that hides itself (and its siblings) through React's
`<Activity mode="hidden">` comes back **partially transparent** when the
Activity is shown again, and stays that way until it is pressed again. The
reproduction lives in `src/components/activity-button.tsx` and is the home
screen of the app.

### Environment

| | |
|---|---|
| Expo SDK | 57 (`expo ~57.0.26`) |
| React Native | 0.86.3, New Architecture (Fabric) |
| React | 19.2.3 |
| Platform | iOS, iPhone 17 Pro simulator, iOS 26.3 |

Android was not tested.

### Steps

1. Tap the top button. Its `onPress` sets the Activity to `hidden`, so both
   buttons disappear.
2. Tap **Show again**.

Expected: both buttons return at full opacity.
Actual: the tapped button returns at `activeOpacity` (0.2). The untouched
control button is fine. Pressing the faded button once restores it.

### What is going on

Two independent faults stack up. Each was isolated by patching
`node_modules/react-native` and measuring the button colour in simulator
screenshots. #2563eb at 0.2 opacity over white is exactly rgb(211, 224, 251),
which is what every failing run produced.

**1. A stale native animation callback overwrites the reset (JavaScript).**
Hiding an Activity calls `componentWillUnmount` on class components, so
`TouchableOpacity` runs `this.state.anim.resetAnimation()` and sets the JS
value back to 1. Stopping a native-driver animation makes iOS report the
animation's current value back to JS asynchronously, and `Animation.js`
applies that value unconditionally. A few milliseconds after the reset, JS
believes the opacity is 0.2 again. A patch that ignores the reported end value
after a JS-initiated `setValue`/`resetAnimation` keeps the JS value at 1.
Relevant files: `Libraries/Animated/animations/Animation.js`,
`Libraries/Animated/nodes/AnimatedValue.js`.

**2. iOS Fabric drops animated updates while the view is hidden (native).**
Fabric does not mount `display: none` views at all, which is how React hides
an Activity on React Native. The opacity update that the reset pushes to the
native view therefore has no view to land on and is silently discarded in
`RCTSurfacePresenter`. When the Activity is shown again the re-mounted view
keeps whatever its layer last had, which is the pressed-in 0.2. Pushing a
distinctive value such as 0.5 while hidden confirmed this: it never showed up.
Timing matters for any re-sync after reveal: a push from `componentDidMount`
or a `requestAnimationFrame` scheduled inside the reveal commit still arrives
before the native re-mount and is lost. A push issued 50 ms or later after the
reveal reaches the view.

Fixing only fault 1 leaves the view stuck at 0.2. Fixing only fault 2 would
re-render the view with the stale JS value. Both are needed.

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

   `.npmrc` sets `legacy-peer-deps=true` because SDK 58 ships React Native
   0.88.0-rc.3 and `react-native-reanimated` declares a peer range of
   `0.86 - 0.88`, which npm does not match against a prerelease. Remove the
   setting once SDK 58 is stable on a non-RC React Native.

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Xcode 26.3 patch (optional)

The iOS build fails on Xcode 26.3 (Swift 6.2) because `expo-modules-jsi` uses
a constructor annotation and `nonisolated(unsafe)` locals that only newer
toolchains accept. Xcode 26.4 and later are supported upstream. See
[expo/expo#50067](https://github.com/expo/expo/issues/50067).

This project carries a patch for it in `patches/expo-modules-jsi+58.0.7.patch`.
It is **not** applied automatically. If you are on Xcode 26.3 and the iOS
build fails, apply it once after installing dependencies:

```bash
npm run patch:xcode26
```

This runs [patch-package](https://github.com/ds300/patch-package) against
`node_modules`. Re-run it after anything that recreates `node_modules`, such
as `npm ci` or reinstalling `expo-modules-jsi`. The patch is harmless on
toolchains that do not need it.

To remove the patch without reinstalling:

```bash
npx patch-package --reverse
```

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

### Other setup steps

- To set up ESLint for linting, run `npx expo lint`, or follow our guide on ["Using ESLint and Prettier"](https://docs.expo.dev/guides/using-eslint/)
- If you'd like to set up unit testing, follow our guide on ["Unit Testing with Jest"](https://docs.expo.dev/develop/unit-testing/)
- Learn more about the TypeScript setup in this template in our guide on ["Using TypeScript"](https://docs.expo.dev/guides/typescript/)

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
