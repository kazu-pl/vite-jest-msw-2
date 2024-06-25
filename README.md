I followed steps listed [here](https://dev.to/teyim/effortless-testing-setup-for-react-with-vite-typescript-jest-and-react-testing-library-1c48)

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
