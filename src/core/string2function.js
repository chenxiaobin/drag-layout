const StringToFn = function toFn (args, body) {
  if (arguments.length === 1) {
    body = args
    args = undefined
  }
  if (!body) {
    return () => {}
  }
  if (!body.includes('return')) {
    // 去除前后空格、换行
    body = body.replace(/^\s*/g, '')
    body = 'return ' + body
  }
  try {
    // eslint-disable-next-line
    return args ? new Function(...args, body) : new Function(body)
  } catch (e) {
    // 这里需要把异常抛出来吗
    window.console.warn('函数解析失败', `'${body}'`)
    throw new Error('函数解析失败', `'${body}'`)
  }
}
export default StringToFn
