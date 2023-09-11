import { ComponentStyleConfig, defineStyleConfig } from '@chakra-ui/react'

const styles: ComponentStyleConfig  = defineStyleConfig({

    variants: {

        primary: {
            backgroundColor: 'primary',
            color: 'secondary',
        }
    }
})

export default styles