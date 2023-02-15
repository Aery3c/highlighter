// @flow
'use strict'

type Listener = () => void;
type ListenerMap = { [key: string]: Listener };
const apply = Function.prototype.apply, call = Function.prototype.call;
export default class EventEmitter<U: ListenerMap> {
  __events__: Object;
  constructor() {
    this.__events__ = {};
  }

  on<T: Object> (type: T, listener: U[T]): EventEmitter<U> {
    const data = this.__events__;
    if (!data[type]) data[type] = listener;
    else if (typeof data[type] === 'object') data[type].push(listener);
    else data[type] = [data[type], listener];

    return this;
  }

  once<T: Object> (type: T, listener: U[T]): EventEmitter<U> {
    let once, self;

    self = this;
    // $FlowIgnore
    self.on.call(self, type, once = function () {
      // $FlowIgnore
      self.off.call(self, type, once);
      apply.call(listener, self, arguments);
    });
    // $FlowIgnore
    once.__onceListener__ = listener;
    return this;
  }

  off<T: Object> (type: T, listener: U[T]): EventEmitter<U> {
    const data = this.__events__;
    if (!data[type]) return this;

    const listeners = data[type];

    if (typeof listeners === 'object') {
      for (let i = 0, candidate; (candidate = listeners[i]); ++i) {
        if ((candidate === listener) ||
          (candidate.__onceListener__ === listener)) {
          if (listeners.length === 2) data[type] = listeners[i ? 0 : 1];
          else listeners.splice(i, 1);
        }
      }
    } else {
      if ((listeners === listener) ||
        (listeners.__onceListener__ === listener)) {
        delete data[type];
      }
    }

    return this;
  }

  emit<T: Object> (type: T): void {
    let listeners = this.__events__[type];
    if (!listeners) return;

    let l, args, i;

    if (typeof listeners === 'object') {
      l = arguments.length;
      args = new Array(l - 1);
      for (i = 1; i < l; ++i) args[i - 1] = arguments[i];

      listeners = listeners.slice();
      for (let i = 0, listener; (listener = listeners[i]); ++i) {
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
}