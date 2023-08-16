import { Input, Select } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'

type DefaultTableCellProps = {
    getValue: () => unknown
    row: any
    column: any
    table: any
}

export const DefaultTableCell: React.FC<DefaultTableCellProps> = ({ getValue, row: { index }, column, table }) => {

    const initialValue = getValue()
    const meta = column.columnDef.meta // not typed on purpose
    
    // We need to keep and update the state of the cell normally
    const [value, setValue] = useState(initialValue)

    // When the input is blurred, we'll call our table meta's updateData function
    const onBlur = () => {

        if (meta.customValidation) {
            const result = meta.customValidation(value)
            if (result.type === 'error') {
                setValue(initialValue)
                toast.error(result.message)
                return
            }
        }

        table.options.meta?.updateData(index, column.id, value)
    }

    // If the initialValue is changed external, sync it up with our state
    useEffect(() => {
        setValue(initialValue)
    }, [initialValue])

    switch (meta?.type) {

        case 'text':
        case 'number':
        case 'date':
            return (
                <Input
                    type={meta.type}
                    variant='unstyled'
                    fontSize='sm'
                    value={value as string || ''}
                    onChange={e => setValue(e.target.value)}
                    onBlur={onBlur}
                />
            )
            break
        case 'select':
            // 
            return (
                <Select fontSize='sm'>
                    <option value={''}></option>
                    {meta.choices?.map((choice: string) => <option key={choice} value={choice}>{choice}</option>)}
                </Select>
            )
            break
        default:
            <Input
                variant='unstyled'
                value={value as string || ''}
                fontSize='sm'
                onChange={e => setValue(e.target.value)}
                onBlur={onBlur}
            />
    }
}