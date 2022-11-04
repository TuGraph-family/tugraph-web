# TuGraph Browser

TuGraph Browser 是 TuGraph 图数据库的可视化工具。使用 TuGraph Browser 可以完成图谱、模型、数据等的创建和导入。同时可用使用 TuGraph Cypher 进行数据的操作。

## 安装项目

```
npm install
```

### 启动开发项目

```
npm run serve
```

### 项目编译

```
npm run build
```

### 开发环境

```
node 16+
npm 7.6.0
```

### 如何替换 tugraph 前端

1. 首先编译此项目
2. 查看 tugraph 的配置文件。默认配置在/usr/local/etc/lgraph.json.；配置文件中 web 配置项

```json
{
    "directory": "/var/lib/lgraph/data",
    "license": "/var/lib/lgraph/fma.lic",

    "host": "0.0.0.0",
    "port": 7070,
    "rpc_port": 9090,
    "enable_rpc": true,
    "enable_ha": false,

    "verbose": 1,
    "log_dir": "/var/log/lgraph_log",

    "disable_auth": false,
    "ssl_auth": false,
    "server_key": "/usr/local/etc/lgraph/server-key.pem",
    "server_cert": "/usr/local/etc/lgraph/server-cert.pem",
    "web": "/usr/local/share/lgraph/resource"
}
```

3. 将 build 后，会在当前目录产生一个 dist 文件夹。
4. 用 dist 文件夹中的内容替换/usr/local/share/lgraph/resource 中内容及完成操作
