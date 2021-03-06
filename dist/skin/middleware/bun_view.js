'use strict';
const fs = require("fs");
const path_1 = require("path");
const pug = require("pug");
module.exports = (path, opts) => {
    path = path_1.resolve(path || 'views');
    opts = opts || {};
    const ext = '.' + (opts.ext || 'html');
    const render = pug.renderFile;
    return function view(ctx, next) {
        if (ctx.render) {
            return next();
        }
        ctx.renderHtml = (_view, locals) => {
            let appPath;
            if (ctx.bun.isSingle) {
                appPath = '';
            }
            else {
                const appname = _view.split('/')[0];
                appPath = '/' + appname;
            }
            const manifest = fs.readFileSync(ctx.bun.globalPath.ROOT_PATH + '/static' + appPath + '/manifest.json');
            const state = Object.assign({}, ctx.state, locals, { staticSources: JSON.parse(manifest.toString()) });
            return new Promise((res, rej) => {
                render(path + '/' + _view + ext, state, (err, html) => {
                    if (err) {
                        return rej(err);
                    }
                    res(html);
                });
            });
        };
        ctx.render = (_view, locals) => {
            let appPath;
            if (ctx.bun.isSingle) {
                appPath = '';
            }
            else {
                const appname = _view.split('/')[0];
                appPath = '/' + appname;
            }
            const manifest = fs.readFileSync(ctx.bun.globalPath.ROOT_PATH + '/static' + appPath + '/manifest.json');
            const state = Object.assign({}, ctx.state, locals, { staticSources: JSON.parse(manifest.toString()) });
            return new Promise((res, rej) => {
                render(path + '/' + _view + ext, state, (err, html) => {
                    if (err) {
                        return rej(err);
                    }
                    ctx.type = 'text/html';
                    ctx.body = html;
                    res();
                });
            });
        };
        return next();
    };
};
//# sourceMappingURL=bun_view.js.map