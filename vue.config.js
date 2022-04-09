const path = require('path');
const autoprefixer = require('autoprefixer')
const pxtorem = require('postcss-pxtorem') // 转rem
function resolve(dir) {
    return path.join(__dirname, dir);
}
module.exports = {
    chainWebpack: config => {
        config.resolve.alias
            .set("@", resolve("src"))
            .set("@assets", resolve("src/assets"))
            .set("@components", resolve("src/components"))
            .set("@base", resolve("baseConfig"))
            .set("@public", resolve("public"));
    },
    css: {
        loaderOptions: {
            scss: {
                prependData: `@import "~@/assets/css/const.scss";`
            },
            less: {
                globalVars: {
                  hack: `true; @import '~@/assets/css/common.less';`
                }
              },
            postcss: {
                plugins: [
                    // autoprefixer(),
                    pxtorem({
                        rootValue: 100,
                        minPixelValue: 2,
                        propList: ['*'],
                        selectorBlackList: ['van','a-radio-button']
                    })
                ]
            }
        }
    },
    publicPath:  './', 
    // 代理 测试
    devServer: {
        // development server port 8000
        port: 7747,
        proxy: {
          '/api_zxl': {
            target: 'http://192.168.2.35:8081/',
            ws: false,
            changeOrigin: true,
            pathRewrite:{
                '^/api_zxl':''  
            },
          },
          '/api_xlj': {
            target: 'http://192.168.2.127:8082/',
            ws: false,
            changeOrigin: true,
            pathRewrite:{
                '^/api_xlj':''  
            },
          }
        }
    },
}
