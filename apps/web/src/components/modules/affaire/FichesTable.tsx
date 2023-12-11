import { Box, Button, HStack, Progress } from '@chakra-ui/react'
import {
  FicheDetail,
  GroupeMachine,
  fetchApiFichesCreate,
  fetchApiFichesDeleteCreate,
  fetchApiFichesPartialUpdate,
  fetchApiGroupeMachineList,
  useApiAffairesFichesRetrieve,
} from '@sgm/openapi'
import { Table, TableLayout, createColumnMeta } from '@sgm/ui'
import { useNavigate } from '@sgm/web/router'
import { createColumnHelper } from '@tanstack/react-table'
import React from 'react'
import { LoaderFunction } from 'react-router-typesafe'
import { toast } from 'react-toastify'
import { AddFicheModele } from '../fiche/AddFicheModele'
import { EtapesTable } from '../fiche/EtapesTable'
import { PrintFicheButton } from '../fiche/PrintFicheButton'
import { AffaireNotesDrawer } from './AffaireNotesDrawer'

export const Loader = (() => {
	return fetchApiGroupeMachineList({})
}) satisfies LoaderFunction

export const Catch = () => {
	return <div>Erreur</div>
}

const columnHelper = createColumnHelper<FicheDetail>()

const columns = [
	columnHelper.accessor('titre', {
		header: 'Titre',
		meta: createColumnMeta({
			disableWarnings: true,
			editable: true,
			type: 'text',
		}),
	}),
	columnHelper.accessor('description', {
		id: 'description',
		header: 'Description',
		meta: createColumnMeta({
			editable: true,
			type: 'text',
		}),
	}),
	columnHelper.accessor('avancement_fiche', {
		header: 'Avancement',
		cell: (value) => (
			<Box>
				<Box
					as='span'
					fontSize='xs'
				>
					{value.getValue()}%
				</Box>
				<Progress
					value={value.getValue()}
					background='#c7d2fe'
					borderRadius='10px'
					size='sm'
					mt='.5em'
				/>
			</Box>
		),
	}),
	columnHelper.accessor('cout_fiche', {
		header: 'Coût',
	}),
    columnHelper.accessor('fourniture', {
        header: 'Fournitures',
        meta: createColumnMeta({
            editable: true,
            type: 'boolean',
        }),
    }),
    columnHelper.display({
		id: 'print',
		cell: (cell) => (
			<PrintFicheButton
				ficheId={cell.row.original.id}
				buttonSize='xs'
			/>
		),
	}),
]

type FichesTableProps = {
	affaireId: number
	groupesMachines: GroupeMachine[]
	refetches?: Array<() => void>
}

export const FichesTable: React.FC<FichesTableProps> = (props) => {
	const navigate = useNavigate()
	const fiches = useApiAffairesFichesRetrieve({
		pathParams: { id: props.affaireId },
	})

	const refetchAll = () => {
		fiches.refetch()
		props.refetches?.forEach((refetch) => refetch())
	}

	return (
		<Box
			className='not-striped'
			w='100%'
		>
			<TableLayout
				header={{
					title: 'Fiches',
					customComponent: (
						<HStack spacing='1em'>
							<AddFicheModele
								affaireId={props.affaireId}
								refetch={fiches.refetch}
							/>
							<AffaireNotesDrawer affaireId={props.affaireId} />
						</HStack>
					),
				}}
				chakraProps={{
					minHeight: 'unset',
				}}
			>
				<Table<FicheDetail>
					data={fiches.data?.fiches || []}
					columns={columns}
					loading={fiches.isLoading}
					editable={{
						enabled: true,
						onRowUpdate: async (row, newData) => {
							fetchApiFichesPartialUpdate({
								pathParams: { id: row.original.id },
								body: newData,
							})
								.then(() => {
									refetchAll()
									toast.success('Fiche mise à jour')
								})
								.catch(() =>
									toast.error(
										'Erreur lors de la mise à jour de la fiche'
									)
								)
						},
					}}
					sortable
					newRow={() => {
						fetchApiFichesCreate({
							body: {
								affaire: props.affaireId,
								titre: `${
									fiches.data?.num_affaire || '???'
								} - `,
							},
						}).then(() => {
							refetchAll()
							toast.success('Fiche créée')
						})
					}}
					rowSelection={{
						enabled: true,
						selectionActionComponent: ({
							checkedItems,
							resetSelection,
						}) => (
							<Button
								size='sm'
								colorScheme='red'
								borderRadius='4px'
								variant='outline'
								onClick={async () => {
									fetchApiFichesDeleteCreate({
										body: {
											ids: checkedItems.map(
												(item) => item.original.id
											),
										},
									})
										.then(() => {
											resetSelection()
											refetchAll()
											toast.success(
												'Etapes supprimées avec succès'
											)
										})
										.catch(() =>
											toast.error(
												'Erreur lors de la suppression des étapes'
											)
										)
								}}
							>
								Supprimer
							</Button>
						),
					}}
					rowAction={{
						enableCtrlClick: true,
						actionFn: (row) =>
							navigate('/affaires/:numAffaire/fiches/:id', {
								params: {
									numAffaire: `${row.original.num_affaire}`,
									id: `${row.original.id}`,
								},
							}),
					}}
					rowExpansion={{
						enabled: true,
						renderComponent: ({ row }) => (
							<EtapesTable
								ficheId={row.original.id}
								groupesMachines={props.groupesMachines}
								refetches={[
									fiches.refetch,
									...(props.refetches || []),
								]}
							/>
						),
					}}
					loadingSkeletonRowsCount={3}
				/>
			</TableLayout>
		</Box>
	)
}
