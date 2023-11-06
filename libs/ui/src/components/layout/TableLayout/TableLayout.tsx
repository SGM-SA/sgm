import { Box, ChakraProps, TableContainer } from '@chakra-ui/react'
import React from 'react'
import { TableHeader } from '../../table/TableHeader/TableHeader'

type TableLayoutProps = {
    /**
     * Table component
    */
    children: React.ReactNode
    /**
     * Personalize the table header with either a title, a custom component displayed on its right or both
     */
    header?: {
        title?: string
        customComponent?: React.ReactElement
    }
    /**
    * Styling
    */
   chakraProps?: ChakraProps
}

export const TableLayout: React.FC<TableLayoutProps> = (props) => {

	return <>

        <TableContainer 
            w='100%' minH='70vh'
            display='flex' flexDirection='column' justifyContent='flex-start' alignItems='flex-start' 
            {...props.chakraProps}
        >

            <Box w='100%' position='relative'>

                <TableHeader
                    title={props.header?.title}
                >
                    
                    {props.header?.customComponent}
                </TableHeader>
            </Box>

            {props.children}
        
        </TableContainer>

    </>
}