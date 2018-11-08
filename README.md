[![build status](https://img.shields.io/travis/indexzero/http-server.svg?style=flat-square)](https://travis-ci.org/indexzero/http-server)
[![dependencies status](https://img.shields.io/david/indexzero/http-server.svg?style=flat-square)](https://david-dm.org/indexzero/http-server)
[![npm](https://img.shields.io/npm/v/http-server.svg?style=flat-square)](https://www.npmjs.com/package/http-server)
[![license](https://img.shields.io/github/license/indexzero/http-server.svg?style=flat-square)](https://github.com/indexzero/http-server)

# http-server: a command-line http server

`http-server` is a simple, zero-configuration command-line http server.  It is powerful enough for production usage, but it's simple and hackable enough to be used for testing, local development, and learning.

![](https://github.com/nodeapps/http-server/raw/master/screenshots/public.png)

# Installing globally:

Installation via `npm`:

     npm install server-lxy -g

This will install `http-server` globally so that it may be run from the command line.

## Usage:

     server-lxy [path] [options]

`[path]` defaults to `./public` if the folder exists, and `./` otherwise.

*Now you can visit http://localhost:8080 to view your server*

**Note:** Caching is on by default. Add `-c-1` as an option to disable caching.

## Available Options:

`-p` or `--port` Port to use (defaults to 8080)

`-0` Address to use (defaults to localhost)

`-d` Show directory listings (defaults to `true`)

