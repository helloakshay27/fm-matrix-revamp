import {
  __esm
} from "./chunk-OL46QLBJ.js";

// node_modules/@babel/runtime/helpers/esm/arrayLikeToArray.js
function _arrayLikeToArray(r, a) {
  (null == a || a > r.length) && (a = r.length);
  for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e];
  return n;
}
var init_arrayLikeToArray = __esm({
  "node_modules/@babel/runtime/helpers/esm/arrayLikeToArray.js"() {
  }
});

// node_modules/@babel/runtime/helpers/esm/unsupportedIterableToArray.js
function _unsupportedIterableToArray(r, a) {
  if (r) {
    if ("string" == typeof r) return _arrayLikeToArray(r, a);
    var t = {}.toString.call(r).slice(8, -1);
    return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0;
  }
}
var init_unsupportedIterableToArray = __esm({
  "node_modules/@babel/runtime/helpers/esm/unsupportedIterableToArray.js"() {
    init_arrayLikeToArray();
  }
});

export {
  _arrayLikeToArray,
  init_arrayLikeToArray,
  _unsupportedIterableToArray,
  init_unsupportedIterableToArray
};
//# sourceMappingURL=chunk-S2APMLR4.js.map
