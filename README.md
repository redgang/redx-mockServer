> redx-mockServer 数据模拟服务

- 基于 `json-server` 服务
- 基于 `faker` 构造数据
- 基于`gulp4.0`构建版本，后期会出一个`webpack2.0`版本


## 目录结构

```
redx-mockServer
├── bin                 [数据模拟脚本]
├── config              [服务配置项]
├── db                  [数据库]
├── src                 [核心代码目录]
│   ├── assets          [静态资源]
│   │   └── images
│   ├── docs            [文档说明]
│   ├── libs            [依赖库]
│   ├── themes          [主题库]
│   │   ├── css
│   │   └── fonts
│   ├── utils           [业务逻辑js]
│   └── views           [业务展示view]
└── test                [测试用例]
```
## 使用

- 安装

```
    npm install
```

- 编译
```
    npm run gulp
    #监听
    npm run gulp watch 
```

- 启动服务

```
    npm start 
```

- 数据生成

```
    npm run db
```



