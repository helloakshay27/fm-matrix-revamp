import {
  _unsupportedIterableToArray,
  init_unsupportedIterableToArray
} from "./chunk-S2APMLR4.js";
import {
  __esm
} from "./chunk-OL46QLBJ.js";

// node_modules/@babel/runtime/helpers/esm/arrayWithHoles.js
function _arrayWithHoles(r) {
  if (Array.isArray(r)) return r;
}
var init_arrayWithHoles = __esm({
  "node_modules/@babel/runtime/helpers/esm/arrayWithHoles.js"() {
  }
});

// node_modules/@babel/runtime/helpers/esm/iterableToArrayLimit.js
function _iterableToArrayLimit(r, l) {
  var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"];
  if (null != t) {
    var e, n, i, u, a = [], f = true, o = false;
    try {
      if (i = (t = t.call(r)).next, 0 === l) {
        if (Object(t) !== t) return;
        f = false;
      } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = true) ;
    } catch (r2) {
      o = true, n = r2;
    } finally {
      try {
        if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return;
      } finally {
        if (o) throw n;
      }
    }
    return a;
  }
}
var init_iterableToArrayLimit = __esm({
  "node_modules/@babel/runtime/helpers/esm/iterableToArrayLimit.js"() {
  }
});

// node_modules/@babel/runtime/helpers/esm/nonIterableRest.js
function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
var init_nonIterableRest = __esm({
  "node_modules/@babel/runtime/helpers/esm/nonIterableRest.js"() {
  }
});

// node_modules/@babel/runtime/helpers/esm/slicedToArray.js
function _slicedToArray(r, e) {
  return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest();
}
var init_slicedToArray = __esm({
  "node_modules/@babel/runtime/helpers/esm/slicedToArray.js"() {
    init_arrayWithHoles();
    init_iterableToArrayLimit();
    init_unsupportedIterableToArray();
    init_nonIterableRest();
  }
});

export {
  _slicedToArray,
  init_slicedToArray
};
//# sourceMappingURL=chunk-5IT4NBOJ.js.map
