function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const { getOptions } = require('loader-utils');
const mdx = require('@mdx-js/mdx');

module.exports = (() => {
  var _ref = _asyncToGenerator(function* (content) {
    const callback = this.async();
    const options = getOptions(this);

    const result = yield mdx(content, options || {});

    if (typeof options !== "undefined" & typeof options.process == "function")
		 return callback(null, options.process(result));

    return callback(null, result);
  });

  return function (_x) {
    return _ref.apply(this, arguments);
  };
})();
