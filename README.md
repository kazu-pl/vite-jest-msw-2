This project was developed with:

node: 18.18.1

npm: 9.8.1

# - BELOW IS MSW INTEGRATED FOR BROWSER:

I followed steps listed [here](https://mswjs.io/docs/integrations/browser)

`1` - use command `npx msw init . --save` which will create file `mockServiceWorker.js`

This command will also change `package.json` file:

```json
{
  "msw": {
    "workerDirectory": [""]
  }
}
```

`2` - create handler:

```ts
// src/mocks/browser.ts
import { setupWorker } from "msw/browser";
import { handlers } from "./handlers"; // same handlers for same endpoints as in msw/node

export const worker = setupWorker(...handlers);
```

`3` - conditionally enable MSW:

```ts
// src/main.tsx

async function enableMocking() {
  if (process.env.NODE_ENV !== "development") {
    return;
  }

  const { worker } = await import("./mocks/browser");

  // `worker.start()` returns a Promise that resolves
  // once the Service Worker is up and ready to intercept requests.
  return worker.start();
}

enableMocking().then(() => {
  ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
});
```

and then if you see:

```
[MSW] Mocking enabled.
```

in the browser when running app it means everything works correctly.

---

# - BELOW IS MSW INTEGRATED WITH jest TESTS:

I followed steps listed [here](https://dev.to/teyim/effortless-testing-setup-for-react-with-vite-typescript-jest-and-react-testing-library-1c48)

Those steps are:

`1` - Setting up a Vite project
`npm create vite@latest`

`2` - Installing Jest and React testing library
run command: `npm install -D jest @testing-library/react ts-jest @types/jest ts-node @testing-library/jest-dom jest-environment-jsdom @testing-library/user-event`

`3` - Now create a `jest.setup.ts` file with the following code:

```ts
// src/jest.setup.ts / I put it in src dir, not in the root dir as it was in the guide

import "@testing-library/jest-dom";
```

Also, create a `jest.config.js` file with the following configuration code:

```js
// jest.config.ts (I changed extension from *.js to *.ts)

export default {
  testEnvironment: "jsdom",
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },
  setupFilesAfterEnv: ["<rootDir>/src/jest.setup.ts"], // I changed path to "<rootDir>/src/jest.setup.ts" because I created that file in src dir
};
```

`4` - Handling Styles and SVG's
run command: `npm install -D identity-obj-proxy jest-transformer-svg`

After successfully installing, modify your `jest.config.ts` file to look like so:

```ts
export default {
  testEnvironment: "jsdom",
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },

  moduleNameMapper: {
    "\\.(css|less|sass|scss)$": "identity-obj-proxy",
    "^.+\\.svg$": "jest-transformer-svg",
  },

  setupFilesAfterEnv: ["<rootDir>/src/jest.setup.ts"], // I changed path to "<rootDir>/src/jest.setup.ts" because I created that file in src dir
};
```

Our test passes..in some cases, this will fail because of the Typescript error.

We fix this by including our `jest.setup.ts` file in our `tsconfig.json` file like so:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,

    /* Bundler mode */
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",

    /* Linting */
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src", "./jest.setup.ts"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

Specifically, we add `./jest.setup.ts` as an array value of the include property. Our Typescript error now disappears and our test runs smoothly.

`5` - Handling absolute imports
run command: `npm install -D vite-tsconfig-paths`
After successful installation, we need to modify the `vite.config.ts` file and the `tsconfig.json` file. add the following code as part of the `compilerOptions` property:

```json
{
  "compilerOptions": {
    "baseUrl": "./src",
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

Our `tsconfig.json` file looks like this:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,

    /* Bundler mode */
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",

    /* Linting */
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,

    //absolute import
    "baseUrl": "./src",
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["src", "./jest.setup.ts"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

We also modify our `vite.config.ts` file:

```ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tsconfigPaths()],
});
```

In your `jest.config.ts` file, add `"^@/(.*)$": "/src/$1"` to the `moduleNameMapper` property:

```ts
export default {
  testEnvironment: "jsdom",
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },

  moduleNameMapper: {
    "\\.(css|less|sass|scss)$": "identity-obj-proxy",
    "^.+\\.svg$": "jest-transformer-svg",
    "^@/(.*)$": "<rootDir>/src/$1", // added
  },

  setupFilesAfterEnv: ["<rootDir>/src/jest.setup.ts"], // I changed path to "<rootDir>/src/jest.setup.ts" because I created that file in src dir
};
```

Amazing!! now you can import components like so:
`import Counter from "@/components/counter-two/Counter-two";`
using the @ path alias and use them in your test.

`6` - Getting test coverage report

Add the following command to your script in the `package.json` file:

```json
{
  "coverage": "npm test --coverage --watchAll --collectCoverageFrom='src/components/**/*.{ts,tsx}'"
}
```

We then run npm run coverage . This runs Jest in watch mode and provides the coverage report after every test run.

---

<!--
key obstacles to overcome were:
a) `ReferenceError: ReadableStream is not defined` oraz
b) `exports is not defined in ES module scope` or `Cannot find module`
c) Error `TS2339: Property 'toBeInTheDocument' does not exist on type 'JestMatchers<HTMLElement>'`
d) error TS2705: An async function or method in ES5 requires the 'Promise' constructor.
-->

# Error `error TS2705: An async function or method in ES5 requires the 'Promise' constructor.`:

If you have the following error:

```
error TS2705: An async function or method in ES5 requires the 'Promise' constructor.  Make sure you have a declaration for the 'Promise' const
ructor or include 'ES2015' in your '--lib' option.

7 async function app() {
```

then add `"lib": [ "es2015" ]` to your `tsconfig.json` in `compilerOptions`:

```json
// tsconfig.json
{
  "compilerOptions": {
    "lib": ["es2018", "dom"]
  }
}
```

Found [here](https://stackoverflow.com/a/61908488)

# Error `TS2339: Property 'toBeInTheDocument' does not exist on type 'JestMatchers<HTMLElement>'`

If you have the following error:

```
$ jest
 FAIL  src/__tests__/App.test.tsx
  ● Test suite failed to run

    src/__tests__/App.test.tsx:17:22 - error TS2339: Property 'toBeInTheDocument' does not exist on type 'JestMatchers<HTMLE
lement>'.

    17   expect(totalItems).toBeInTheDocument();
                            ~~~~~~~~~~~~~~~~~

```

Then you will need to change the location of file `<rootDir>/jest.setup.ts` because in `tsconfig.app.json` there's a `"include": ["src"]` and for some reason if this is set then config file with `import "@testing-library/jest-dom";` needs to be there, in `src` directory (if you remove that `"include": ["src"]` then the file can be in root directory again but that `include` was set by default in the Vite template so we won't change it). Well, actually, if `"include": ["src"]` is set then it's all about putting `import "@testing-library/jest-dom";` in some file in `src` folder. It doesn't even have to be the config file, just any file.
Putting that file in `src` folder will solve the problem for VSC linting and VSC won't tell anymore about not existing method on type JestMatchers.
If we have to move `jest.setup.ts` file to `./src/` we can also change its name to `setupTests.ts` to keep Create-React-App like methodology but it's not needed. Then we have to link it in `jest.config.ts` like so:

```ts
export default {
  setupFilesAfterEnv: ["<rootDir>/src/jest.setup.ts"], // or we can simply leave jest.config.ts file but in src dir instead of rootDir
};
```

Then sometimes when running tests they might still thrown an error that some methods does not exist on type JestMatchers so to avoid that we have to add `"types": ["@testing-library/jest-dom"]` to `tsconfig.json` like this:

```json
{
  "compilerOptions": {
    "types": ["@testing-library/jest-dom"]
  }
}
```

Found [here](https://github.com/testing-library/jest-dom/issues/546#issuecomment-1792349644)

# Error `ReferenceError: ReadableStream is not defined`:

Follow steps from [here](https://github.com/mswjs/msw/discussions/1934#discussioncomment-7874204)

but you will get another error like the following one:

```
 if (V instanceof ReadableStream) {
        ^
TypeError: Right-hand side of 'instanceof' is not an object

```

and to avoid it import `ReadableStream` from `node:stream/web` which will give:

```js
// jest.polyfills.js

const { TextDecoder, TextEncoder } = require("node:util");
const { ReadableStream } = require("node:stream/web");

Object.defineProperties(globalThis, {
  TextDecoder: { value: TextDecoder },
  TextEncoder: { value: TextEncoder },
  ReadableStream: { value: ReadableStream },
});
```

# Error `TextEncoder is not defined`:

follow steps from [here](https://mswjs.io/docs/faq/#requestresponsetextencoder-is-not-defined-jest)

# Error `Cannot find module 'msw/node' from 'src/mocks/node.ts'`:

Update your `jest.config.json` file to:

```json
// jest.config.json
{
  "testEnvironmentOptions": {
    "customExportConditions": [""]
  }
}
```

Found [here](https://stackoverflow.com/a/77415620)

# Error `exports is not defined in ES module scope` or `Cannot find module`:

`1` - Update your `package.json`:

```json
{
  "type": "module",
  "scripts": {
    "start": "npx ts-node main.ts" // does not contain any --esm
  }
}
```

`2` - update your `tsconfig.json`:

```json
{
  "ts-node": {
    "esm": true, // its the same as --esm would do but it's better to have it like this
    "experimentalSpecifierResolution": "node"
  },
  "compilerOptions": {
    "esModuleInterop": true,
    "moduleResolution": "node",
    "module": "ESNext"
  }
}
```

To be precise `"module": "ESNext"` fixes `exports is not defined in ES module scope` issue and:

```json
{
  "ts-node": {
    "experimentalSpecifierResolution": "node"
  }
}
```

fixes `Cannot find module` issue but then another issue will show:

```
src/mocks/node.ts:2:29 - error TS2792: Cannot find module 'msw/node'. Did you mean to set the 'moduleResolution' option to '
nodenext', or to add aliases to the 'paths' option?

2 import { setupServer } from "msw/node";

```

which will be fixed by adding `"moduleResolution": "node",` to `compilerOptions` in `tsconfig.json`

Found [here](https://stackoverflow.com/a/75396267)

# Error `Unknown file extension ".ts"`

To fix it, either add `--esm` flag to script like so:

`"msw:esm": "npx ts-node --esm ./src/index.ts"`

BUT IT'S BETTER TO add "ts-node" object with "esm" value to your `tsconfig.json` file:

```json
{
  "ts-node": {
    "esm": true
  }
}
```

# Error If you have issue `error TS17004: Cannot use JSX unless the '--jsx' flag is provided.`:

If you have error like this:

```
/2018/01/31/announcing-typescript-2-7/#easier-ecmascript-module-interoperability for more information.
 FAIL  src/__tests__/App.test.tsx
  ● Test suite failed to run

    src/__tests__/App.test.tsx:5:17 - error TS6142: Module '../App' was resolved to 'D:/React_PRACTISE/vite_msw/src/App.tsx'
, but '--jsx' is not set.

    5 import App from "../App";
                      ~~~~~~~~
    src/__tests__/App.test.tsx:12:10 - error TS17004: Cannot use JSX unless the '--jsx' flag is provided.

    12   render(<App />);
                ~~~~~~~

```

then you should add option `"jsx": "react-jsx",` to your `package.json`:

```json
{
  "compilerOptions": {
    "jsx": "react-jsx"
  }
}
```

It's important to add it to main `tsconfig.json` file.

# Error message TS151001: If you have issues related to imports, you should consider setting `esModuleInterop` to `true`:

If you have error:

```
ts-jest[config] (WARN) message TS151001: If you have issues related to imports, you should consider setting `esModuleInterop RUNS  src/__tests__/App.test.tsx
` to `true` in your TypeScript configuration file (usually `tsconfig.json`). See https://blogs.msdn.microsoft.com/typescript

```

then add in your `tsconfig.json` file the following option:

```json
{
  "compilerOptions": {
    "esModuleInterop": true
  }
}
```

You have to add it to main `tsconfig.json` file even if you have more configuration files like `tsconfig.app.json` or `tsconfig.node.json`. Adding that option to `.app.json` or `.node.json` won't make any effect

# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default {
  // other rules...
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    project: ["./tsconfig.json", "./tsconfig.node.json"],
    tsconfigRootDir: __dirname,
  },
};
```

- Replace `plugin:@typescript-eslint/recommended` to `plugin:@typescript-eslint/recommended-type-checked` or `plugin:@typescript-eslint/strict-type-checked`
- Optionally add `plugin:@typescript-eslint/stylistic-type-checked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and add `plugin:react/recommended` & `plugin:react/jsx-runtime` to the `extends` list
