import {
  _arrayLikeToArray,
  _unsupportedIterableToArray,
  init_arrayLikeToArray,
  init_unsupportedIterableToArray
} from "./chunk-S2APMLR4.js";

// node_modules/@babel/runtime/helpers/esm/arrayWithoutHoles.js
init_arrayLikeToArray();
function _arrayWithoutHoles(r) {
  if (Array.isArray(r)) return _arrayLikeToArray(r);
}

// node_modules/@babel/runtime/helpers/esm/iterableToArray.js
function _iterableToArray(r) {
  if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r);
}

// node_modules/@babel/runtime/helpers/esm/toConsumableArray.js
init_unsupportedIterableToArray();

// node_modules/@babel/runtime/helpers/esm/nonIterableSpread.js
function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

// node_modules/@babel/runtime/helpers/esm/toConsumableArray.js
function _toConsumableArray(r) {
  return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread();
}

export {
  _toConsumableArray
};
//# sourceMappingURL=chunk-P7JAAH3L.js.map
