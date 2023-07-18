import type { Preview } from '@storybook/react'
import { theme } from '@sgm/theme'

const preview: Preview = {
    parameters: {
        chakra: {
            theme
        }
    }
}

export default preview