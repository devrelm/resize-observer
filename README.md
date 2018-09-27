# resize-observer

[![Build Status][circleci-image]][circleci-url] <!-- [![Coverage Status][coveralls-image]][coveralls-url] --> [![NPM Version][npm-image]][npm-url]

[![npm bundle size (minified + gzip)][size-image]][size-url]

This library aims to be a faithful implementation and [ponyfill](https://ponyfill.com) of the
[Resize Observer draft](https://wicg.github.io/ResizeObserver/). An optional polyfill option exists as well.

[circleci-image]: https://circleci.com/gh/pelotoncycle/resize-observer.svg?style=svg
[circleci-url]: https://circleci.com/gh/pelotoncycle/resize-observer

[coveralls-image]: https://coveralls.io/repos/github/pelotoncycle/resize-observer/badge.svg?branch=master
[coveralls-url]: https://coveralls.io/github/pelotoncycle/resize-observer?branch=master

[npm-image]: https://img.shields.io/npm/v/resize-observer.svg
[npm-url]: https://www.npmjs.com/package/resize-observer

[size-image]: https://img.shields.io/bundlephobia/minzip/resize-observer.svg
[size-url]: https://bundlephobia.com/result?p=resize-observer

# Installation

`resize-observer` is available on NPM and Yarn:

```shell
> npm install resize-observer
```

```shell
> yarn add resize-observer
```

# Setup

## As a ponyfill/module

`resize-observer` does not install itself by default. As such, you can import it like any other module:

```ts
import { ResizeObserver } from 'resize-observer';

const ro = new ResizeObserver(() => console.log('resize observed!'));
ro.observe(document.body);
```

## As a polyfill

`resize-observer` provides a file that can be referenced from your browser that automatically installs `ResizeObserver`
on the global `window` object. Both minified and non-minified versions exist, and are found in the package under the
`dist/` directory:

```html
<script src="/node_modules/resize-observer/dist/resize-observer.js"></script>
<script type="text/javascript">
  const ro = new window.ResizeObserver(() => alert('Observing things is super cool!'));
  /* use your ResizeObserver! */
</script>
```

A `install` method is also provided to do the same within your own code:

```ts
import { install } from 'resize-observer';

install();

const ro = new window.ResizeObserver(() => alert('Observe all the things!'));
/* ... */
```

**Note:** Calling `install` will _always_ overwrite `window.ResizeObserver`.
If you'd like to only install `resize-observer` when it doesn't already exist,
you can add a simple check before calling `install`:

```ts
import { install } from 'resize-observer';

if (!window.ResizeObserver) install();

/* ... */
```

# TypeScript definitions

`resize-observer` is written in TypeScript.
The definition files are included in the package and should be picked up automatically.
