
export default function getQueryVariable (variable) {
  const args = {}
  const query = location.search.substring(1)
  const pairs = query.split('&')
  for (let i = 0; i < pairs.length; i++) {
    const pos = pairs[i].indexOf('=')
    if (pos === -1) {
      continue
    }
    const name = pairs[i].substring(0, pos)
    console.log(name)
    const value = pairs[i].substring(pos + 1)
    args[name] = value
  }
  return args[variable]
}
