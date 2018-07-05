'use strict';

var pluginsConf = require(bun.CONF_PATH + '/plugins.js');
module.exports = function () {
    var context = bun;
    for (var i in pluginsConf) {
        if (pluginsConf.hasOwnProperty(i)) {
            if (pluginsConf[i].enable) {

                // 将插件根据配置加入全局变量bun中
                // 以path属性为先
                try {
                    if (pluginsConf[i].path) {
                        var Model = require(pluginsConf[i].path + '/index.js');
                    } else {
                        var Model = require(bun.MODULES_PATH + '/' + pluginsConf[i].package + '/index.js');
                    }
                } catch (e) {
                    bun.Logger.bunerror(e);
                }

                if (context[i]) {
                    // 如果模块已存在作用域中，则报警并覆盖
                    // throw new Error('Repeated plugin name: ' + i + ' in file: ' + i);
                    bun.Logger.bunwarn('Repeated plugin name: ' + i + ' in file: ' + i);
                }
                context[i] = function () {
                    return Model;
                }();
            }
        }
    }
};