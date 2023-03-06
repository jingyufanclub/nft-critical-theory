import { deepMerge } from 'grommet/utils'
import { grommet } from 'grommet'

const theme = deepMerge(grommet, {
  global: {
    colors: {
      brand: '#f6b6bb',
      'accent-1': '#FDE7E8',
      'accent-2': '#E7C6C8',
      'accent-3': '#005BCC',
      'neutral-1': '#2E3439',
      'light-1': '#FAFAFA',
      'light-2': '#FAFAFA60',
      text: 'accent-1',
      focus: 'accent-1',
      border: 'accent-1',
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
  button: {},
  formField: {
    margin: {
      bottom: 'medium',
    },
    info: {
      color: 'accent-2',
      size: 'small',
    },
  },
  heading: {
    color: 'brand',
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
