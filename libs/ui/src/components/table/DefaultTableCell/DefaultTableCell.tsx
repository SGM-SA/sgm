import { Box, Input, Select } from '@chakra-ui/react'
import { Row, Table } from '@tanstack/react-table'
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { Choice } from '../../../utils/table'

const fontSize = 'xs'

type DefaultTableCellProps<TData> = {
    getValue: () => unknown
    row: Row<TData>
    column: any
    table: Table<TData>
    children?: React.ReactNode
}

export function DefaultTableCell<TData>(props: DefaultTableCellProps<TData>) {

    if (props.column.columnDef.meta?.editable) return <EditableTableCell<TData> {...props} />
    else return <RawTableCell<TData> {...props} />
}

export function RawTableCell<TData>(props: DefaultTableCellProps<TData>) {

    const meta = props.column.columnDef.meta // not typed on purpose

    const doubleClickHandler = () => {
        if (!props.column.columnDef.meta?.disableWarnings) toast.warn("Ce champs n'est pas éditable")
    }

    switch(meta?.type) {

        case 'boolean':
            return <input 
                type='checkbox'
                style={{
                    fontSize: fontSize,
                }}
                checked={!!props.children || props.getValue() as boolean}
                disabled
            />
            break
        default:
            return <Box as='span' 
                fontSize={fontSize}
                onDoubleClick={doubleClickHandler}
            >
                {props.children || props.getValue() as any}
            </Box>
    }
}

export function EditableTableCell<TData>(props: DefaultTableCellProps<TData>) {

    const initialValue = props.getValue()
    const meta = props.column.columnDef.meta // not typed on purpose
    const accessorKey = props.column.columnDef.accessorKey
    
    // We need to keep and update the state of the cell normally
    const [value, setValue] = useState(initialValue)

    // When the input is blurred, we'll call our table meta's updateData function
    const onUpdate = (overrideValue?: any) => {

        const newValue = overrideValue ?? value
        if (newValue === initialValue) return

        if (meta.customValidation) {
            const result = meta.customValidation(newValue)
            if (result.type === 'error') {
                setValue(initialValue)
                toast.error(result.message)
                return
            }
        }

        return props.table.options.meta?.updateData(props.row, accessorKey, newValue)
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
                    fontSize={fontSize}
                    value={value as string || ''}
                    onChange={e => setValue(e.target.value)}
                    onBlur={() => onUpdate()}
                />
            )
            break
        case 'select':
            return (
                <Select 
                    size={fontSize} 
                    value={value as string || ''}
                    onChange={e => {
                        setValue(e.target.value)
                        onUpdate(e.target.value)
                    }}
                >
                    {meta.nullable !== false && <option value={''}></option>}
                    {meta.choices?.map((choice: Choice) => typeof choice === 'string' ?
                        <option key={choice} value={choice}>{choice}</option> :
                        <option key={choice.value} value={choice.value}>{choice.label}</option>
                    )}
                </Select>
            )
            break
        case 'boolean': 
            return (
                <input
                    type='checkbox'
                    style={{
                        fontSize: fontSize,
                    }}
                    checked={value as boolean}
                    onChange={e => {
                        setValue(e.target.checked)
                        onUpdate(e.target.checked)
                    }}
                />
            )
        default:
            return <Input
                variant='unstyled'
                value={value as string || ''}
                fontSize={fontSize}
                onChange={e => setValue(e.target.value)}
                onBlur={() => onUpdate()}
            />
    }
}