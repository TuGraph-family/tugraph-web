const path = require('path')
const os = require('os')

let dir = process.env.DIR
console.log(dir)
module.exports = {
    publicPath: dir,
    productionSourceMap: false,
    devServer: {
        proxy: process.env.VUE_APP_REQUESTURL
    },
    //警告 webpack 的性能提示
    configureWebpack: {
        performance: {
            hints: 'warning',
            //入口起点的最大体积 整数类型（以字节为单位）
            maxEntrypointSize: 50000000,
            //生成文件的最大体积 整数类型（以字节为单位 300k）
            maxAssetSize: 30000000,
            //只给出 js 文件的性能提示
            assetFilter: function(assetFilename) {
                return assetFilename.endsWith('.js')
            }
        }
    },
    chainWebpack: (config) => {
        // ...
        // 添加 worker-loader 支持
        config.module
            .rule('webWorker')
            .post()
            .test(/\.worker\.(j|t)s$/)
            .use('worker-loader')
            .loader('worker-loader')
        config.module
            .rule('i18n')
            .resourceQuery(/blockType=i18n/)
            .type('javascript/auto')
            .use('i18n')
            .loader('@kazupon/vue-i18n-loader')
            .end()
        config.plugin('fork-ts-checker').tap((args) => {
            let totalmem = Math.floor(os.totalmem() / 1024 / 1024) //get OS mem size
            let allowUseMem = totalmem > 2048 ? 4096 : 2048
            args[0].memoryLimit = allowUseMem
            return args
        })
    }
}
