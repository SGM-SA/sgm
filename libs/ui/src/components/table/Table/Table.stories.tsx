import type { Meta, StoryObj } from '@storybook/react'
import { Table } from './Table'
import { createMeta } from '../../../utils/table'
import { createColumnHelper } from '@tanstack/react-table'
import { Err, Ok } from '@sgm/utils'

/**
 * Meta
 */
export default {
	component: Table,
	title: 'UI/Table/Table',
} as Meta<typeof Table>

/**
 * Mock data
 */
type Role = 'User' | 'Admin' | 'Guest'

type User = {
	id: number
	firstName: string
	lastName: string
	age: number
	creation?: Date
	role: Role
}

const columnHelper = createColumnHelper<User>()

const columns = [
    columnHelper.accessor('firstName', {
        id: 'firstName',
        header: 'Prénom',
		meta: createMeta({
			editable: true,
			type: 'text'
		})
    }),
	columnHelper.accessor('lastName', {
		id: 'lastName',
		header: 'Nom',
		meta: createMeta({
			editable: true,
			type: 'text'
		})
	}),
	columnHelper.accessor('age', {
		id: 'age',
		header: 'Age',
		meta: createMeta({
			editable: true,
			type: 'number',
			customValidation: (age) => (age < 1 || age > 120)  ? Err('L\'âge doit être compris entre 1 et 120 ans') : Ok(true)
		})
	}),
	columnHelper.accessor('creation', {
		id: 'creation',
		header: 'Date de création',
		meta: createMeta({
			editable: true,
			type: 'date'
		})
	}),
	columnHelper.accessor('role', {
		id: 'role',
		header: 'Rôle',
		meta: createMeta({
			editable: true,
			type: 'select',
			choices: [
				'Admin',
				'User',
				'Guest'
			]
		})
	})    
]

const generateRandomDate = (start: Date, end: Date): Date => {
	return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
}
  
const generateMockUsers = (): User[] => {

	const mockUsers: User[] = []

	for (let i = 1; i <= 50; i++) {

		const user: User = {
			id: i,
			firstName: `User${i}`,
			lastName: `LastName${i}`,
			age: Math.floor(Math.random() * 40) + 18, // Random age between 18 and 57
			creation: generateRandomDate(new Date(2000, 0, 1), new Date()), // Random date between 2000-01-01 and today
			role: ['User', 'Admin', 'Guest'][Math.floor(Math.random() * 3)] as Role // Random role from the list
		}
	
		mockUsers.push(user);
	}

	return mockUsers 
}

/**
 * Stories
 */
type Story = StoryObj<typeof Table>

export const Primary: Story = {
	args: {
		columns,
		data: generateMockUsers(),
		editable: true,
		sortable: true,
		rowSelection: {
			enabled: true,
			selectionActionComponent: () => <div>Selection action</div>
		},
		rowExpansion: {
			enabled: true,
			renderSubComponent: () => <div>Row expansion</div>
		},
		loading: false,
		header: {
			title: 'Users',
		}
	},
}