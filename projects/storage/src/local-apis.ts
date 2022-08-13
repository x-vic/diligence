import dayjs from 'dayjs'

// 持久化今日状态
export const persiet = (context: Object) => {
  const today = dayjs().startOf('day').format('YYYY-MM-DD')
  localStorage.setItem(
    'tasksContext',
    JSON.stringify({
      date: today,
      context,
    })
  )
}

export const getPersiet = async () => {
  const today = dayjs().startOf('day').format('YYYY-MM-DD')
  const data = localStorage.getItem('tasksContext')
  try {
    const { date, context } = JSON.parse(data)
    if (date === today) return context
    throw `无效数据：${context}`
  } catch (e) {
    throw e
  }
}
