export function random() {
  const r = Math.round(Math.random() * 100)
  return r
}

export function randomNumBothandomNum(min, max) {
  const range = max - min
  const rand = Math.random()
  if (Math.round(rand * range) === 0) {
    return min + 1
  } else if (Math.round(rand * max) === max) {
    return max - 1
  } else {
    const num = min + Math.round(rand * range) - 1
    return num
  }
}

export function randomDoubleArray(min, max) {
  const d = []
  let len = 100
  while (len--) {
    if (len > 45 && len <= 55) {
      d.push([
        randomNumBothandomNum(0, 10),
        randomNumBothandomNum(0, 5),
      ])
    } else {
      d.push([
        randomNumBothandomNum(min, max),
        randomNumBothandomNum(min, max),
      ])
    }
  }
  return d
}

export function randomArray(minNum, maxNum) {
  const d = []
  let len = 100
  while (len--) {
    if (len > 45 && len <= 55) {
      d.push(randomNumBothandomNum(0, 20))
    } else {
      d.push(randomNumBothandomNum(minNum, maxNum))
    }
  }
  return d
}

function formatTime(time, spliter) {
  const d = new Date(time)
  const hour = d.getHours() >= 10 ? d.getHours() : ('0' + d.getHours())
  const minute = d.getMinutes() >= 10 ? d.getMinutes() : ('0' + d.getMinutes())
  return `${hour} ${spliter} ${minute}`
}

export function randomDate() {
  const arr = []
  const startTime = new Date('2019', '01', '01', '08', '0', '0').getTime()
  const endTime = new Date('2019', '01', '01', '09', '40', '0').getTime()
  for (let i = startTime; i <= endTime;) {
    arr.push(formatTime(i, ':'))
    i += 60 * 1000
  }
  return arr
}
