//启动配置项
module.exports = {
    //代理标示
    proxyFlag : '/',
    // proxy配置项
    proxyOption : {
        //代理的目的地址
        target: 'http://localhost:8080/', 
        changeOrigin: true,
        // 代理 websockets
        ws: true,
        //重写代理访问地址                 
        pathRewrite: {
            '/api' : ''
        },
        //根据访问地址重新指定代理地址
        router: {
            // when request.headers.host == 'dev.localhost:3000',
            // override target 'http://www.example.org' to 'http://localhost:8000'
            
            //'dev.localhost:3000' : 'http://localhost:8000'
        }
    },
    //本地服务端口
    port : process.env.PORT || '8080',
    //liveload跟踪文件
    liveloadFiles : /.(js|css|html)$/, 
};