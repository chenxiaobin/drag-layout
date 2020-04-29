
// 深度拷贝
const objDeepCopy = (source) => {
  const sourceCopy = source instanceof Array ? [] : {}
  for (const item in source) {
    sourceCopy[item] = typeof source[item] === 'object' ? objDeepCopy(source[item]) : source[item]
  }
  return sourceCopy
}

export default {
  objDeepCopy
}
