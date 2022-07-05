'use strict'

let descriptors, base, defineProperties = Object.defineProperties, create = Object.create,
  descriptor = { configurable: true, enumerable: false, writable: true },
  defineProperty = Object.defineProperty,
  hasOwnProperty = Object.prototype.hasOwnProperty,
  apply = Function.prototype.apply, call = Function.prototype.call;

function on (type, listener) {
  let data;

  if (!hasOwnProperty.call(this, '__ee__')) {
    data = descriptor.value = create(null);
    defineProperty(this, '__ee__', descriptor);
    descriptor.value = null;
  } else {
    data = this.__ee__;
  }
  if (!data[type]) data[type] = listener;
  else if (typeof data[type] === 'object') data[type].push(listener);
  else data[type] = [data[type], listener];

  return this;
}

function once (type, listener) {
  let once, self;

  self = this;
  on.call(this, type, once = function () {
    off.call(self, type, once);
    apply.call(listener, this, arguments);
  });

  once.__eeOnceListener__ = listener;
  return this;
}

function off (type, listener) {
  let data, listeners, candidate, i;

  if (!hasOwnProperty.call(this, '__ee__')) return this;
  data = this.__ee__;
  if (!data[type]) return this;
  listeners = data[type];

  if (typeof listeners === 'object') {
    for (i = 0; (candidate = listeners[i]); ++i) {
      if ((candidate === listener) ||
        (candidate.__eeOnceListener__ === listener)) {
        if (listeners.length === 2) data[type] = listeners[i ? 0 : 1];
        else listeners.splice(i, 1);
      }
    }
  } else {
    if ((listeners === listener) ||
      (listeners.__eeOnceListener__ === listener)) {
      delete data[type];
    }
  }

  return this;
}

function emit (type) {
  let i, l, listener, listeners, args;

  if (!hasOwnProperty.call(this, '__ee__')) return;
  listeners = this.__ee__[type];
  if (!listeners) return;

  if (typeof listeners === 'object') {
    l = arguments.length;
    args = new Array(l - 1);
    for (i = 1; i < l; ++i) args[i - 1] = arguments[i];

    listeners = listeners.slice();
    for (i = 0; (listener = listeners[i]); ++i) {
      apply.call(listener, this, args);
    }
  } else {
    switch (arguments.length) {
      case 1:
        call.call(listeners, this);
        break;
      case 2:
        call.call(listeners, this, arguments[1]);
        break;
      case 3:
        call.call(listeners, this, arguments[1], arguments[2]);
        break;
      default:
        l = arguments.length;
        args = new Array(l - 1);
        for (i = 1; i < l; ++i) {
          args[i - 1] = arguments[i];
        }
        apply.call(listeners, this, args);
    }
  }
}

descriptors = {
  on: {
    value: on,
    ...descriptor
  },
  once: {
    value: once,
    ...descriptor
  },
  off: {
    value: off,
    ...descriptor
  },
  emit: {
    value: emit,
    ...descriptor
  }
};

base = defineProperties({}, descriptors);

function factory (o) {
  return (o == null) ? create(base) : defineProperties(Object(o), descriptors);
}

export default factory;