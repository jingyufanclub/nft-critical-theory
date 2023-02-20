import { deepMerge } from 'grommet/utils'
import { grommet } from 'grommet'

const theme = deepMerge(grommet, {
  global: {
    colors: {
      brand: '#005BCC',
      'accent-1': '#186ADE',
      'accent-2': '#CC7100',
      'neutral-1': '#2E3439',
      'light-1': '#FAFAFA',
      'light-2': '#FAFAFA60',
      text: 'accent-1',
      focus: 'accent-1',
    },

    font: {
      family: '"Goldman Sans", sans-serif',
    },
  },
  anchor: {
    fontWeight: 600,
    textDecoration: 'none',
    color: 'brand',
    gap: 'small',
    hover: {
      textDecoration: 'underline',
    },
  },
  heading: {
    color: 'accent-1',
    level: {
      1: {
        font: {
          weight: 700,
        },
      },
      2: {
        font: {
          weight: 700,
        },
      },
      3: {
        font: {
          weight: 700,
        },
      },
      4: {
        font: {
          weight: 700,
        },
      },
      5: {
        font: {
          weight: 700,
        },
      },
      6: {
        font: {
          weight: 700,
        },
      },
    },
  },
})

export default theme
