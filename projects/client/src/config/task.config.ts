export const taskConfig = [
  { review: 10, add: 5 },
  { review: 20, add: 10 },
  { review: 40, add: 20 },
  { review: 60, add: 30 },
  { review: 80, add: 40 },
  { review: 100, add: 50 },
  { review: 120, add: 60 },
  { review: 140, add: 70 },
  { review: 160, add: 80 },
  { review: 180, add: 90 },
  { review: 200, add: 100 },
]

export const getTaskConfig = (): { review: number; add: number } => {
  const index = localStorage.getItem('optionIndex') ?? 0
  return taskConfig[index]
}
