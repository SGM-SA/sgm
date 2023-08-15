export const styles = {
 
    global: (props: any) => ({

        'body': {
            padding: 0,
	        margin: 0,
            backgroundColor: 'secondary'
        },

        'table': {
            fontSize: 'xs'
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
        
        '::-webkit-scrollbar': {
            width: '5px'
        },
        '::-webkit-scrollbar-thumb': {
            borderRadius: '10px',
            background: '#5f4e42',
        },
        '::-webkit-scrollbar-track': {
            background: 'rgba(0, 0, 0, 0)'
        }
    })
}