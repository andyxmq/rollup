/**
 * pl library :　orientation detection
 * 横竖屏检测库
 */
;
(function(win, pl) {
    var meta = {},
        cbs = [],
        timer;

    var html = document.documentElement;

    // 订阅与发布
    var event = function() {
        var fnlist = {},
            listen,
            trigger,
            remove;
        listen = function(e, fn) {
            if (!fnlist[e]) {
                fnlist[e] = [];
            }
            fnlist[e].push(fn);
        };
        trigger = function(e) {
            var key = [].shift.call(arguments),
                fns = fnlist[key];
            if (!fns || fns.length === 0) {
                return false;
            }
            for (var i = 0, fn; fn = fns[i++];) {
                fn.apply(this, arguments);
            }
        };
        remove = function(e, fn) {
            var fns = fnlist[e];
            if (!fns) {
                return false;
            }
            if (!fn) {
                fns && (fns.length = 0);
            } else {
                for (var j = 0, l = fns.length; j < l; j--) {
                    if (fn === fns[j]) {
                        fns.splice(j, 1);
                    }
                }
            }
        }
        return {
            listen: listen,
            trigger: trigger,
            remove: remove
        }
    }();

    // automatically load css script
    function loadStyleString(css) {
        var _style = document.createElement('style'),
            _head = document.head ? document.head : document.getElementsByTagName('head')[0];
        _style.type = 'text/css';
        try {
            _style.appendChild(document.createTextNode(css));
        } catch (ex) {
            // lower IE support, if you want to know more about this to see http://www.quirksmode.org/dom/w3c_css.html
            _style.styleSheet.cssText = css;
        }
        _head.appendChild(_style);
        return _style;
    }

    // callback
    var resizeCB = function() {
        var hstyle = win.getComputedStyle(html, null),
            ffstr = hstyle['font-family'],
            pstr = "portrait, " + ffstr,
            lstr = "landscape, " + ffstr,
            cssstr = '@media (orientation: portrait) { .orientation{font-family:' + pstr + ';font-size: 24px;} } @media (orientation: landscape) {  .orientation{font-family:' + lstr + ';font-size: 34px;}}';
        meta.font = ffstr;
        // 载入样式		
        loadStyleString(cssstr);
        // 添加类
        html.className = 'orientation ' + html.className;
        if (hstyle['font-family'] === pstr) { //初始化判断
            meta.init = 'portrait';
            meta.current = 'portrait';
        } else {
            meta.init = 'landscape';
            meta.current = 'landscape';
        }
        return function() {
            if (hstyle['font-family'] === pstr) {
                if (meta.current !== 'portrait') {
                    meta.current = 'portrait';
                    event.trigger('__orientationChange__', meta);
                }
            } else {
                if (meta.current !== 'landscape') {
                    meta.current = 'landscape';
                    event.trigger('__orientationChange__', meta);
                }
            }
        }
    }();
    // 监听
    win.addEventListener('resize', function() {
        timer && win.clearTimeout(timer);
        timer = win.setTimeout(resizeCB, 300);
    }, false);

    event.listen('__orientationChange__', function(event) {
        console.log(event, 'event');
        if (cbs.length === 0) {
            return false;
        }
        for (var i = 0, cb; cb = cbs[i++];) {
            if (typeof cb === 'function') {
                cb.call(pl, event);
            } else {
                throw new Error('The accepted argument of pl.on must be a function.');
            }
        }
    });
    // 接口
    pl.orientation = meta;
    pl.event = event;
    pl.on = function(cb) {
        cbs.push(cb);
    }
})(window, window['pl'] || (window['pl'] = {}));