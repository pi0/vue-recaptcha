var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var defer = function defer() {
  var state = false; // Resolved or not
  var value = void 0;
  var callbacks = [];
  var resolve = function resolve(val) {
    if (state) {
      return;
    }

    state = true;
    value = val;
    callbacks.forEach(function (cb) {
      cb(val);
    });
  };

  var then = function then(cb) {
    if (!state) {
      callbacks.push(cb);
      return;
    }
    cb(value);
  };

  var deferred = {
    resolved: function resolved() {
      return state;
    },

    resolve: resolve,
    promise: {
      then: then
    }
  };
  return deferred;
};

export function createRecaptcha() {
  var deferred = defer();

  return {
    setRecaptcha: function setRecaptcha(recap) {
      deferred.resolve(recap);
    },
    getRecaptcha: function getRecaptcha() {
      return deferred.promise;
    },
    render: function render(ele, key, options, cb) {
      this.getRecaptcha().then(function (recap) {
        var opts = _extends({}, { sitekey: key }, options);
        cb(recap.render(ele, opts));
      });
    },
    reset: function reset(widgetId) {
      if (typeof widgetId === 'undefined') {
        return;
      }

      this.assertRecaptchaLoad();
      this.getRecaptcha().then(function (recap) {
        return recap.reset(widgetId);
      });
    },
    checkRecaptchaLoad: function checkRecaptchaLoad() {
      if (window.hasOwnProperty('grecaptcha')) {
        this.setRecaptcha(window.grecaptcha);
      }
    },
    assertRecaptchaLoad: function assertRecaptchaLoad() {
      if (!deferred.resolved()) {
        throw new Error('ReCAPTCHA has not been loaded');
      }
    }
  };
}

var recaptcha = createRecaptcha();

if (typeof window !== 'undefined') {
  window.vueRecaptchaApiLoaded = function () {
    recaptcha.setRecaptcha(window.grecaptcha);
  };
}

export default recaptcha;