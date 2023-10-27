import { ChakraProps } from "@chakra-ui/react"

type Styles = Record<string, Record<string, ChakraProps> | ((props: any) => Record<string, ChakraProps>)>

export const styles: Styles = {

    global: (props: any) => ({

        'body': {
            padding: 0,
	        margin: 0,
            backgroundColor: 'secondary.100'
        },

        'table': {
            fontSize: 'xs'
        },

        '.not-striped tr:nth-of-type(odd) td': {
            background: 'transparent !important',
        },

        '.full-width': {
            width: '100%',
        },

        /**
         * Resets
         */

        '*': {
            margin: 0,
            padding: 0,
            boxSizing: 'border-box',
        },

        'a': {
            color: 'inherit',
            textDecoration: 'none',
        },

        /**
         * Scrollbar
         */

        '::-webkit-scrollbar': {
            width: '5px',
            height: '5px'
        },
        '::-webkit-scrollbar-thumb': {
            borderRadius: '10px',
            background: '#5f4e42',
        },
        '::-webkit-scrollbar-track': {
            background: 'rgba(0, 0, 0, 0)'
        },

        /**
         * Misc
         */

        '.invisible-disabled input': {
            opacity: '1 !important',
            cursor: 'default !important',
        }


    })
}
