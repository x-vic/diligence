import { createMachine } from 'xstate'

export const toggleMachine = createMachine({
  initial: 'hide',
  states: {
    hide: {
      on: {
        TOGGLE: 'show',
      },
    },
    show: {
      on: {
        TOGGLE: 'hide',
      },
    },
  },
})
