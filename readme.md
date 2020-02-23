## Install

```sh
$ cd /
$ npm install
```

```sh
$ cd /merger
$ npm install
```

## Tasks

compile application files

```sh
$ gulp combine
```

merge component files

```sh
$ gulp components
```

before run combine, after components

```sh
$ gulp build
```

## Watch

run combine task and watch

```sh
$ gulp
```

just watch

```sh
$ gulp watch
```

## Debug

generate source map files

```sh
$ gulp <task> --sourcemaps
```

## Production

generate minified files

```sh
$ gulp <task> --production
```

## Serve

run combine and watch task

```sh
$ gulp serve
```