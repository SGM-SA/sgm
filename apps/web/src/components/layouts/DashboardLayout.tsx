import { Box, Link as ChakraLink, Flex, HStack, Heading, Text, VStack } from '@chakra-ui/react'
import { Link } from '@sgm/web/router'
import React, { JSXElementConstructor, ReactElement } from 'react'
import useReactRouterBreadcrumbs from 'use-react-router-breadcrumbs'
import { SideBar } from '../modules'

type RouteMatcher = string | RegExp

const breadcrumbHiddenRoutes: RouteMatcher[] = [
	'/'
]

const breadcrumbUnlickableRoutes: RouteMatcher[] = [
	'/planning',
	/\/affaires\/.*\/fiches/g,
]

type DashboardLayoutProps = {
	title: React.ReactNode
	children: React.ReactNode
	customHeader?: React.ReactNode
	styling?: {
		addPadding?: boolean
		removeTitleMarginBottom?: boolean
	}
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

					<VStack justifyContent='flex-start' alignItems='flext-start' mt='5em' mb='1em'>

						<Box fontSize='sm'>
							{breadcrumbs
								.map<React.ReactNode>(({ breadcrumb, key }) => {

									if (breadcrumbHiddenRoutes.includes(key)) return null
									const name = (breadcrumb as ReactElement<any, string | JSXElementConstructor<any>>).props.children

									const clickable = !breadcrumbUnlickableRoutes.some(route => {
										if (typeof route === 'string') return route === key
										else return route.test(key)
									})

									if (clickable) return (
										// @ts-ignore
										<ChakraLink key={key} as={Link} to={key} mx='.2em'>
											{name}
										</ChakraLink>
									)
									else return (
										<Text key={key} as='span' mx='.2em'>
											{name}
										</Text>
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
