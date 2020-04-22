'use strict';

let uid = 0;

class Dep {
  constructor() {
    this.id = uid++;
    this.subs = [];
  }
  depend() {
    Dep.target.addDep(this);
  }
  addSub(sub) {
    this.subs.push(sub);
  }
  notify() {
    this.subs.forEach(sub => sub.update());
  }
}

function isObject(val) {
  return typeof val === 'object'
}

function hasOwn(val, key) {
  const hasOwnProperty = Object.prototype.hasOwnProperty;
  return hasOwnProperty.call(val, key)
}

class Watcher {
  constructor(proxy, expOrFn, cb) {
    this.depIds = {};
    this.proxy = proxy;
    this.cb = cb;
    this.expOrFn = expOrFn;
    const isLegal = this.checkParam(proxy, expOrFn, cb);
    this.val = this.get(isLegal);
  }
  checkParam(proxy, expOrFn, cb) {
    if (!(proxy._isObserved)) {
      console.warn("Watcher need an observed object for arguments[0] but got other object,try to use observe method to get an observed object.");
      return false
    }
    if (!(typeof expOrFn === "string" || typeof expOrFn === "function")) {
      console.warn(`Watcher need a expression or a function for arguments[1] but got a ${typeof expOrFn}.`);
      return false
    }
    if (!(typeof cb === "function")) {
      console.warn(`Watcher need a function for arguments[2] but got a ${typeof cb}.`);
      return false
    }
    return true
  }
  update() {
    this.run();
  }
  addDep(dep) {
    if (!this.depIds.hasOwnProperty(dep.id)) {
      dep.addSub(this);
      this.depIds[dep.id] = dep;
    }
  }
  run() {
    const val = this.get(true);
    if (val !== this.val) {
      this.cb.call(this.proxy, val, this.val);
      this.val = val;
    }
  }
  get(isLegal) {
    if (!isLegal) return
    Dep.target = this;
    let val;
    if (typeof this.expOrFn === "function") {
      val = this.expOrFn();
    } else if (this.expOrFn.includes('.')) {
      const expArr = this.expOrFn.split('.');
      val = expArr.reduce((proxy, exp) => {
        return proxy[exp]
      }, this.proxy);
    } else {
      val = this.proxy[this.expOrFn];
    }
    Dep.target = null;
    return val
  }
}

let raw2Proxy = new WeakMap();
let proxy2Raw = new WeakMap();

class Observer {
  constructor(value) {
    this.value = value;
    this.dep = new Dep();
    this._proxy = this.proxy(value);
  }
  proxy(value) {
    const self = this;
    let observed = raw2Proxy.get(value);
    if (observed) {
      return observed
    }
    if (proxy2Raw.has(value)) {
      //check
      console.warn("proxy2Raw");
      return value
    }
    observed = new Proxy(value, {
      get(target, key, receiver) {
        if (Dep.target) {
          self.dep.depend();
        }
        const result = Reflect.get(target, key, receiver);
        return isObject(result) ? observe(result) : result
      },
      set(target, key, val, receiver) {
        const hadKey = hasOwn(target, key);
        const oldValue = target[key];
        val = proxy2Raw.get(val) || val;
        if (oldValue === val) {
          return true
        }
        const result = Reflect.set(target, key, val, receiver);
        self.dep.notify();
        return result
      }
    });
    observed._isObserved = true;
    observed.watch = function (expOrFn, cb) {
      return new Watcher(this, expOrFn, cb)
    };
    raw2Proxy.set(value, observed);
    proxy2Raw.set(observed, value);
    return observed
  }
}

function observe(value) {
  if (!value || typeof value !== 'object') {
    return
  }
  return new Observer(value)._proxy
}

function compile(el, proxy) {
  if (!el || el.nodeType !== 1) {
    console.warn("You should provide an element node for render method.");
    return
  }
  if(!proxy._isObserved){
    proxy = observe(proxy);
  }
  let fragment = document.createDocumentFragment();
  let child;
  while (child = el.firstChild) {
    fragment.appendChild(child);
  }

  function replace(frag) {
    Array.from(frag.childNodes).forEach(node => {
      const text = node.textContent;
      const reg = /\{\{(.*?)\}\}/g;
      if (node.nodeType === 3 && reg.test(text)) {
        const initSymbol = Symbol.for("replaceText");

        function replaceText(initSymbol) {
          node.textContent = text.replace(reg, (matched, placeholder) => {
            if (initSymbol === Symbol.for("replaceText")) {
              new Watcher(proxy, placeholder, replaceText);
            }
            const res = placeholder.split('.').reduce((val, key) => {
              return val[key]
            }, proxy);
            return res && res.toString && res.toString()
          });
        }
        replaceText(initSymbol);
      }
      if (node.childNodes && node.childNodes.length) {
        replace(node);
      }
    });
  }
  replace(fragment);
  el.appendChild(fragment);
  return proxy
}

function Silicagel(){

}
Silicagel.render = compile;
Silicagel.observe = observe;
Silicagel.Watcher = Watcher;

module.exports = Silicagel;
