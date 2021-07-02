export default function initNum (val, str = 0) {
  if (val === undefined || val === '' || isNaN(val) || isNaN(parseFloat(val))) {
    return str
  } else {
    return parseFloat(val)
  }
}
