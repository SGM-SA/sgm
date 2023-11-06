import { ComponentStyleConfig, defineStyleConfig } from '@chakra-ui/react'

const styles: ComponentStyleConfig  = defineStyleConfig({

    variants: {

        primary: {
            backgroundColor: 'primary.100',
            color: 'secondary.100',
        }
    }
})

export default styles
