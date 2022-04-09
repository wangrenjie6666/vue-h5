const path = require('path');
function resolve(dir) {
    return path.join(__dirname, dir);
}
module.exports = {
    devServer: {
        port:6996,
    },
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
            less: {
                globalVars: {
                  hack: `true; @import '~@/assets/css/common.less';`
                }
              },
            postcss: {
                plugins: [
                    require('postcss-pxtorem')({
                        rootValue: 37.5,
                        propList: ['*']
                    })
                ]
            }
        }
    },
}
