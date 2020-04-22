import {
  Watcher,
  observe,
} from "../proxy/index"

function compile(el, proxy) {
  if (!el || el.nodeType !== 1) {
    console.warn("You should provide an element node for render method.")
    return
  }
  if(!proxy._isObserved){
    proxy = observe(proxy)
  }
  let fragment = document.createDocumentFragment()
  let child
  while (child = el.firstChild) {
    fragment.appendChild(child)
  }

  function replace(frag) {
    Array.from(frag.childNodes).forEach(node => {
      const text = node.textContent
      const reg = /\{\{(.*?)\}\}/g
      if (node.nodeType === 3 && reg.test(text)) {
        const initSymbol = Symbol.for("replaceText")

        function replaceText(initSymbol) {
          node.textContent = text.replace(reg, (matched, placeholder) => {
            if (initSymbol === Symbol.for("replaceText")) {
              new Watcher(proxy, placeholder, replaceText)
            }
            const res = placeholder.split('.').reduce((val, key) => {
              return val[key]
            }, proxy)
            return res && res.toString && res.toString()
          })
        }
        replaceText(initSymbol)
      }
      if (node.childNodes && node.childNodes.length) {
        replace(node)
      }
    })
  }
  replace(fragment)
  el.appendChild(fragment)
  return proxy
}

export {
  compile
}