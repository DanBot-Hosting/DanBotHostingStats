!(function(e) {
    var t = {};
    function r(n) {
        if (t[n]) return t[n].exports;
        var o = t[n] = {
            i: n,
            l: !1,
            exports: {}
        };
        return e[n].call(o.exports, o, o.exports, r), o.l = !0, o.exports;
    }
    r.m = e,
    r.c = t,
    r.d = function(e, t, n) {
        r.o(e, t) || Object.defineProperty(e, t, {
            enumerable: !0,
            get: n
        });
    },
    r.r = function(e) {
        typeof Symbol !== 'undefined' && Symbol.toStringTag && Object.defineProperty(e, Symbol.toStringTag, {
            value: 'Module'
        }),
        Object.defineProperty(e, '__esModule', {
            value: !0
        });
    },
    r.t = function(e, t) {
        if (1 & t && (e = r(e)), 8 & t) return e;
        if (4 & t && typeof e === 'object' && e && e.__esModule) return e;
        var n = Object.create(null);
        if (r.r(n), Object.defineProperty(n, 'default', {
            enumerable: !0,
            value: e
        }),
        2 & t && typeof e !== 'string') for (var o in e)r.d(n, o, (t => e[t]).bind(null, o));
        return n;
    },
    r.n = function(e) {
        var t = e && e.__esModule ? function() {
            return e.default;
        } : function() {
            return e;
        };
        return r.d(t, 'a', t), t;
    },
    r.o = function(e, t) {
        return Object.prototype.hasOwnProperty.call(e, t);
    },
    r.p = '',
    r(r.s = 100);
}({
    100(e, t, r) {
        'use strict';
        r.r(t);
        var n = r(3);
        if (typeof ServiceWorkerGlobalScope !== 'undefined') {
            var o = `https://arc.io${n.k}`; importScripts(o);
        } else if (typeof SharedWorkerGlobalScope !== 'undefined') {
            var c = `https://arc.io${n.i}`; importScripts(c);
        } else if (typeof DedicatedWorkerGlobalScope !== 'undefined') {
            var i = `https://arc.io${n.b}`; importScripts(i);
        }
    },
    3(e, t, r) {
        'use strict';
        r.d(t, 'a', () => n),
        r.d(t, 'f', () => c),
        r.d(t, 'j', () => i),
        r.d(t, 'i', () => a),
        r.d(t, 'b', () => d),
        r.d(t, 'k', () => f),
        r.d(t, 'c', () => p),
        r.d(t, 'd', () => s),
        r.d(t, 'e', () => l),
        r.d(t, 'g', () => m),
        r.d(t, 'h', () => v);
        var n = {
            images: ['bmp', 'jpeg', 'jpg', 'ttf', 'pict', 'svg', 'webp', 'eps', 'svgz', 'gif', 'png', 'ico', 'tif', 'tiff', 'bpg'],
            video: ['mp4', '3gp', 'webm', 'mkv', 'flv', 'f4v', 'f4p', 'f4bogv', 'drc', 'avi', 'mov', 'qt', 'wmv', 'amv', 'mpg', 'mp2', 'mpeg', 'mpe', 'm2v', 'm4v', '3g2', 'gifv', 'mpv'],
            audio: ['mid', 'midi', 'aac', 'aiff', 'flac', 'm4a', 'm4p', 'mp3', 'ogg', 'oga', 'mogg', 'opus', 'ra', 'rm', 'wav', 'webm', 'f4a', 'pat'],
            documents: ['pdf', 'ps', 'doc', 'docx', 'ppt', 'pptx', 'xls', 'otf', 'xlsx'],
            other: ['swf']
        };
        var o = 'arc:';
        var c = {
            COMLINK_INIT: ''.concat(o, 'comlink:init'),
            NODE_ID: ''.concat(o, ':nodeId'),
            CDN_CONFIG: ''.concat(o, 'cdn:config'),
            P2P_CLIENT_READY: ''.concat(o, 'cdn:ready'),
            STORED_FIDS: ''.concat(o, 'cdn:storedFids'),
            SW_HEALTH_CHECK: ''.concat(o, 'cdn:healthCheck'),
            WIDGET_CONFIG: ''.concat(o, 'widget:config'),
            WIDGET_INIT: ''.concat(o, 'widget:init'),
            WIDGET_UI_LOAD: ''.concat(o, 'widget:load'),
            BROKER_LOAD: ''.concat(o, 'broker:load'),
            RENDER_FILE: ''.concat(o, 'inlay:renderFile'),
            FILE_RENDERED: ''.concat(o, 'inlay:fileRendered')
        };
        var i = 'serviceWorker';
        var a = '/'.concat('shared-worker', '.js');
        var d = '/'.concat('dedicated-worker', '.js');
        var f = '/'.concat('arc-sw-core', '.js');
        var u = ''.concat('arc-sw', '.js'); var p = ('/'.concat(u), '/'.concat('arc-sw'), 'arc-db');
        var s = 'key-val-store'; var l = 2 ** 17; var m = ''.concat('https://overmind.arc.io', '/api/propertySession');
        var v = ''.concat('https://warden.arc.io', '/mailbox/propertySession');
    }
}));