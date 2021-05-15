/**
 *
 * loadScript.js 动态加载脚本
 *
 */

function loadScript(src, callback) {
  const script = document.createElement('script')
  script.type = 'text/javascript'
  script.onload = () => {
    if (typeof callback === 'function') {
      callback()
    }
  }
  script.src = src

  document.head.appendChild(script)
}

export default loadScript
