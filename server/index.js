let http = require('http');
let url = require('url');
let path = require('path');
let fs = require('mz/fs');
let zlib = require('zlib');
//三方模块
let mime = require('mime');
let ejs = require('ejs');
let chalk = require('chalk'); //粉笔
let debug = require('debug')('dev');
let {
  readFileSync
} = require('fs');
let tmpl = readFileSync(path.join(__dirname, 'template.html'), 'utf8')
class Server {
  constructor(config) {
    this.config = config;
    this.tmpl = tmpl;
  }
  gzip(req, res) {
    let gzip = req.headers['accept-encoding'];
    if (gzip) {
      if (gzip.match(/\bgzip\b/)) {
        res.setHeader('Content-Encoding', 'gzip');
        return zlib.createGzip();
      } else if (gzip.match(/\bdeflate\b/)) {
        res.setHeader('Content-Encoding', 'deflate');
        return zlib.createDeflate();
      }
    } else {
      return false
    }
  }
  sendFile(req, res, statObj, realPath) {
    res.setHeader('Cache-Control', '10000');
    res.setHeader('Expires', new Date(Date.now() + 10 * 1000).toGMTString());
    res.setHeader('Content-Type', mime.getType(realPath) + ';charset=utf8');
    res.setHeader('Last-Modified', statObj.ctime.toGMTString());
    let ctime = req.headers['if-modified-since'];
    if (ctime === statObj.ctime.toGMTString()) {
      res.statusCode = 304;
      res.end();
    }
    let gzip;
    if (gzip = this.gzip(req, res)) {
      fs.createReadStream(realPath).pipe(gzip).pipe(res);
      return;
    }
    fs.createReadStream(realPath).pipe(res)
  }
  sendError(req, res, e) {
    res.statusCode = 404;
    res.end(`Not Found`);
  }
  async handleRequest(req, res) {
    let {
      dir
    } = this.config;
    let {
      pathname
    } = url.parse(req.url)
    let realPath = decodeURIComponent(path.join(dir, pathname))
    try {
      let statObj = await fs.stat(realPath);
      if (statObj.isDirectory()) {
        let html = path.join(realPath, 'index.html')
        try {
          await fs.access(html)
          this.sendFile(req, res, null, html)
        } catch (e) {
          let dirs = await fs.readdir(realPath);
          let renderStr = ejs.render(this.tmpl, {
            dirs: dirs.map(item => ({
              n: item,
              path: path.join(pathname, item)
            }))
          })
          res.setHeader('Content-Type', 'text/html;charset=utf8')
          res.end(renderStr)
        }
      } else {
        this.sendFile(req, res, statObj, realPath)
      }
    } catch (e) {
      this.sendError(req, res, e)
    }
  }
  start() {
    let server = http.createServer(this.handleRequest.bind(this));
    let {
      port,
      host
    } = this.config;
    server.listen(port, host, () => {
      console.log(chalk.green(`http://${host}:${chalk.red(port)}  server`))
    })
  }
}
module.exports = Server