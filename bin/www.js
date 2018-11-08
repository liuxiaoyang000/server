#! /usr/bin/env node
let package = require('../package.json');
let comannder = require('commander');
let parser ={
  port:8080,
  host:'localhost',
  dir:process.cwd()
}
comannder.on('--help', () => {
  console.log('Usage:')
  console.log('server-lxy -p 8080')
})
let args = comannder
.version(package.version)
.option('-p --port <v>','server port')
.option('-o --host <v>', 'server hostname')
.option('-d --dir <v>','server directory')
.parse(process.argv)
let Server = require('../server')
let server=new Server({...parser,...args})
server.start()