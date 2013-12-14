# frbs

A CLI Firebase Client built on node.


## Installation

Available [via NPM](https://npmjs.org/package/frbs):

```
$ npm install frbs -g
```


## Usage

```
Firebase CLI Client

Usage:
frbs [options] [auth_token@]ref[/path]

If path ends with '/', output will be the result of 'child_added' event(s); otherwise 'value' event(s).

Options:
  --help               Display usage information
  -d, --demo           Use firebaseio-demo.com domain
  -m, --min, --minify  Minify output
  -f                   Wait for new data instead of terminating
```
