# vite-hmr-plugin-test

Do custom hot module replacement on [Vite](https://vitejs.dev/) using a plugin

### Run

```sh
pnpm i
pnpm dev
```

### How does it work?

- In `vite-plugin-custom-hmr.ts`, we define a plugin `CustomHMR`
  - In the `transform` hook, we check if the module inherits from any of `hotBaseClasses` using [ts-morph](https://ts-morph.com/)
  - If it does, we inject a code that grants that the module can HMR using HMR API `import.meta.hot.accept`
  - In the `import.meta.hot.accept`, it calls elements of `window.hotComponentObservers` with an event object that contains replacing class names and the module itself
- In `src/sceneRootHMR.ts`, it listens to the `window.hotComponentObservers`
  - Once it receives an event, it replaces the specified classes under the descendant of `sceneRoot` with the new module
