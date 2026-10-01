# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

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

This project carries a patch for it in `patches/expo-modules-jsi+57.1.1.patch`.
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
