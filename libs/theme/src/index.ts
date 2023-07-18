import { extendTheme, ThemeConfig } from '@chakra-ui/react'

import { colors, fonts, styles } from './bases'
import { components } from './components'

const config: ThemeConfig = {
    initialColorMode: 'light',
    useSystemColorMode: false,
}

// here we customize the global theme of Chakra-UI
export const theme = extendTheme({
    config,
    fonts,
    colors,
    styles,
    components,
})