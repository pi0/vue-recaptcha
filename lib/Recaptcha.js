var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

import recaptcha from './recaptcha-wrapper';

export default {
  props: {
    sitekey: {
      type: String,
      required: true
    },
    options: {
      type: Object,
      default: function _default() {
        return {};
      }
    }
  },
  created: function created() {
    this.$widgetId = null;
    recaptcha.checkRecaptchaLoad();
  },
  mounted: function mounted() {
    var self = this;
    var opts = _extends({}, this.options, {
      callback: this.emitVerify,
      'expired-callback': this.emitExpired
    });
    recaptcha.render(this.$refs.container, this.sitekey, opts, function (id) {
      self.$widgetId = id;
      self.$emit('render', id);
    });
  },

  methods: {
    reset: function reset() {
      recaptcha.reset(this.$widgetId);
    },
    emitVerify: function emitVerify(response) {
      this.$emit('verify', response);
    },
    emitExpired: function emitExpired() {
      this.$emit('expired');
    }
  },
  events: {
    recaptchaReset: function recaptchaReset() {
      this.reset();
    }
  },
  render: function render(h) {
    return h(
      'div',
      { ref: 'container' },
      []
    );
  }
};