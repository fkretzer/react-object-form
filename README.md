[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)
[![npm version](https://badge.fury.io/js/react-object-form.svg)](https://badge.fury.io/js/react-object-form)
[![Build Status](https://travis-ci.org/fkretzer/react-object-form.svg?branch=master)](https://travis-ci.org/fkretzer/react-object-form)
[![Dependency Status](https://www.versioneye.com/user/projects/57d7c71dbf2b4b0050f30ae8/badge.svg)](https://www.versioneye.com/user/projects/57d7c71dbf2b4b0050f30ae8)
[![Greenkeeper badge](https://badges.greenkeeper.io/fkretzer/react-object-form.svg)](https://greenkeeper.io/)

# React Object Form



-> [EXAMPLE](https://jsfiddle.net/dhfsk/gfzpghun/)

## Get it

https://www.npmjs.com/package/react-object-form

Use UMD module (dist/ReactObjectForm.js) from npm package or build by yourself. If you have some module-loading infrastructure, you can import the module directly (`lib/ReactObjectForm.js`) this expects [react-select](https://github.com/JedWatson/react-select) to be available for import.

`npm install react-object-form` -> dist/ReactObjectForm.js is a UMD module which needs React and `react-select` as dependencies.
The rendered markup uses Bootstrap css classes, so include some bootstrap.css to get default styling. The select-component uses [react-select](https://github.com/JedWatson/react-select) and also needs [css styles](https://raw.githubusercontent.com/JedWatson/react-select/master/dist/react-select.css) from there. Import the defaults, or style yourself.

## Use it
-> [Base example on JSFiddle](https://jsfiddle.net/dhfsk/gfzpghun/)

```javascript
<ReactObjectForm object={{name: "Foo", age: 12, }} 
config={[{name: "name", label: "NAME"}]} 
changeHandler={changedObject => console.log(changedObject)} />
```

## Change it
### Run & develop
- git clone ...
- npm start -> starts ui-harness with live reloading on localhost:3030

### Contribute

This repo uses sematic-release. To make my life easier, please prefix your commit-messages according to the [convention](https://github.com/conventional-changelog/conventional-changelog-angular/blob/master/convention.md), or use [commitizen](https://commitizen.github.io/cz-cli/) for a super easy contribution experience:
```bash
npm install -g commitizen
git add .
git cz
```
