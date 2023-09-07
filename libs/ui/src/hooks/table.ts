import { PaginationState } from '@tanstack/react-table'
import { useState } from 'react'

const defaultPageIndex = 0
const defaultPageSize = 10

export const useTableQueryHelper = (initialData: PaginationState = { pageIndex: defaultPageIndex, pageSize: defaultPageSize }) => {

    const [pagination, setPagination] = useState<PaginationState>(initialData)
    const [sorting, setSorting] = useState<string>('')

    const fetchDataOptions = {
        queryParams: {
            page: (pagination.pageIndex + 1).toString(),
            per_page: pagination.pageSize.toString(),
            ordering: sorting
        }
    }

    return {
        pagination,
        setPagination,
        sorting,
        setSorting,
        fetchDataOptions
    }
}