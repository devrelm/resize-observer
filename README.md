# resize-observer

[![Build Status][travis-image]][travis-url] [![Coverage Status][coveralls-image]][coveralls-url]

This library aims to be a faithful implementation and polyfill of the
[Resize Observer draft](https://wicg.github.io/ResizeObserver/).

[travis-image]: https://travis-ci.org/pelotoncycle/resize-observer.svg?branch=master
[travis-url]: https://travis-ci.org/pelotoncycle/resize-observer

[coveralls-image]: https://coveralls.io/repos/github/pelotoncycle/resize-observer/badge.svg?branch=master
[coveralls-url]: https://coveralls.io/github/pelotoncycle/resize-observer?branch=master

# Installation

`resize-observer` is available on NPM and Yarn:

```
npm install resize-observer
```

```
yarn add resize-observer
```

# Setup

`resize-observer` installs itself as `window.ResizeObserver` when it is required or otherwise put on the page:

```
require('resize-observer');

const ro = new window.ResizeObserver();
```

```
<script src="/path/to/resize-observer.js"></script>
<script type="text/javascript">
  const ro = new window.ResizeObserver();
</script>
```

**NOTE**: this behavior (auto-installing) may change in a future version.
