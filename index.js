var connect = require('connect'),
    liveload = require('liveload'),
    proxy = require('http-proxy-middleware'),
    opener = require("opener"),
    ip = require('ip');

var data = require('./db/data.json');
var jsonServer = require('json-server'),
    clone = require('clone'),
    app = jsonServer.create(),
    router = jsonServer.router(clone(data))

var config = require('./config/index');
var host = ip.address()
var srcPath = process.cwd() + '/';

app.use(liveload({
    root: srcPath,
    files: config.liveloadFiles,
    excludes: /^node_modules$/
}))
    .use(connect['static'](srcPath))
    .use(connect.directory(srcPath))
    .use(config.proxyFlag, proxy(config.proxyOption));

app.use((req, res, next) => {
    if (req.path === '/') return next()
    router.db.setState(clone(data))
    next()
})

app.use(jsonServer.defaults({
    logger: process.env.NODE_ENV !== 'production'
}))
app.use(router)

app.listen(config.port, () => {
    console.log("服务已启动: http://" + host + ":" + config.port)
})
opener("http://" + host + ":" + config.port)

