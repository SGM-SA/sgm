import { PaginationState } from '@tanstack/react-table'
import { useState } from 'react'

const defaultPageIndex = 0
const defaultPageSize = 10

export const usePagination = (initialData: PaginationState = { pageIndex: defaultPageIndex, pageSize: defaultPageSize }) => {

    const [pagination, setPagination] = useState<PaginationState>(initialData)

    const fetchDataOptions = {
        queryParams: {
            page: (pagination.pageIndex + 1).toString(),
            per_page: pagination.pageSize.toString()
        }
    }

    return {
        pagination,
        setPagination,
        fetchDataOptions
    }
}