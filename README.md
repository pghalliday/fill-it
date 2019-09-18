# fill-it

A chrome extension to fill forms

## Development notes

The development tool chain depends on [NodeJS and NPM](https://nodejs.org/).

After cloning run the following command to download dependencies

```
npm install
```

Then to build and watch for changes

```
npm start
```

The extension artifacts will be placed in the `dist` folder. Under `chrome://extensions/` enable `Developer mode` and use the `Load unpacked` button to add the `dist` folder for testing.

The options UI has been created using [MobX and React](https://mobx.js.org/getting-started.html) and [Blueprint](https://blueprintjs.com/).
