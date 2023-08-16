import { PaginationState } from '@tanstack/react-table'
import { useState } from 'react'

export const usePagination = (initialData: PaginationState = { pageIndex: 0, pageSize: 10 }) => {

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