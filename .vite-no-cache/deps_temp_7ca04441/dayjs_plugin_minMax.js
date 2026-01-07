import {
  __commonJS
} from "./chunk-OL46QLBJ.js";

// node_modules/dayjs/plugin/minMax.js
var require_minMax = __commonJS({
  "node_modules/dayjs/plugin/minMax.js"(exports, module) {
    !function(e, n) {
      "object" == typeof exports && "undefined" != typeof module ? module.exports = n() : "function" == typeof define && define.amd ? define(n) : (e = "undefined" != typeof globalThis ? globalThis : e || self).dayjs_plugin_minMax = n();
    }(exports, function() {
      "use strict";
      return function(e, n, t) {
        var i = function(e2, n2) {
          if (!n2 || !n2.length || 1 === n2.length && !n2[0] || 1 === n2.length && Array.isArray(n2[0]) && !n2[0].length) return null;
          var t2;
          1 === n2.length && n2[0].length > 0 && (n2 = n2[0]);
          t2 = (n2 = n2.filter(function(e3) {
            return e3;
          }))[0];
          for (var i2 = 1; i2 < n2.length; i2 += 1) n2[i2].isValid() && !n2[i2][e2](t2) || (t2 = n2[i2]);
          return t2;
        };
        t.max = function() {
          var e2 = [].slice.call(arguments, 0);
          return i("isAfter", e2);
        }, t.min = function() {
          var e2 = [].slice.call(arguments, 0);
          return i("isBefore", e2);
        };
      };
    });
  }
});
export default require_minMax();
//# sourceMappingURL=dayjs_plugin_minMax.js.map
