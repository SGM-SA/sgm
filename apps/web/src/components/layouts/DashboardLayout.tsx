import { Box, Flex, HStack, Heading, VStack, Link as ChakraLink } from '@chakra-ui/react'
import React, { JSXElementConstructor, ReactElement } from 'react'
import { SideBar } from '../modules'
import useReactRouterBreadcrumbs from 'use-react-router-breadcrumbs'
import { Link } from '@sgm/web/router'

const ignoredRoutes = [
	'/'
]

type DashboardLayoutProps = {
	title: React.ReactNode
	children: React.ReactNode
  styling?: {
    addPadding?: boolean
    removeTitleMarginBottom?: boolean
  }
	customHeader?: React.ReactNode
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = (props) => {

	const breadcrumbs = useReactRouterBreadcrumbs()

	return <>

		{/* Sidebar */}
		<SideBar />

		{/* Background style */}
		<Box
			position='absolute'
			top='0'
			left='0'
			width='100%'
			height='40vh'
			background='primary.100'
			zIndex={-1}
		/>

		<Flex
			w='100%'
			justifyContent='center'
		>
			<VStack
				alignItems='flex-start'
				w='95%'
			>

				<HStack
					justifyContent='space-between'
					alignItems='center'
					w='100%'
					color='secondary.100'
				>

					<VStack justifyContent='flex-start' alignItems='flext-start' mt='5em' mb={props.styling?.removeTitleMarginBottom ? '1em' : '5em'}>

						<Box fontSize='sm'>
							{breadcrumbs
								.map<React.ReactNode>(({ breadcrumb, key }) => {

									if (ignoredRoutes.includes(key)) return null
									const name = (breadcrumb as ReactElement<any, string | JSXElementConstructor<any>>).props.children

									return (
										// @ts-ignore
										<ChakraLink key={key} as={Link} to={key} mx='.2em'>
											{name}
										</ChakraLink>
									)
								})
								.filter(segment => segment !== null)
								.reduce((prev, curr) => [prev, ' / ', curr])
							}
						</Box>

						<Heading as='h1'
						>
							{props.title}
						</Heading>
					</VStack>

					{props.customHeader}

				</HStack>
				{/* Title */}

				{/* Main window content */}
				<VStack
					as='main'
					w='100%'
					padding={props.styling?.addPadding ? '2em' : '0'}
					backgroundColor='secondary.100'
					border='1px solid'
					borderColor='gray.200'
					alignItems='flex-start'
					alignSelf='center'
					borderRadius='5px'
				>
					{props.children}
				</VStack>

			</VStack>
		</Flex>
	</>

}
