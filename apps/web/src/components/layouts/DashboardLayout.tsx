import { Box, Flex, HStack, Heading, VStack } from '@chakra-ui/react'
import React from 'react'
import { SideBar } from '../modules'

type DashboardLayoutProps = {
	title: string
	children: React.ReactNode
	removePadding?: boolean
	customHeader?: React.ReactNode
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = (props) => {

	return (
		<>
			{/* Sidebar */}
			<SideBar />

			{/* Background style */}
			<Box
				position='absolute'
				top='0'
				left='0'
				w='100%'
				h='40vh'
				bg='primary'
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
					>

						<Heading as='h1'
							color='secondary'
							mt='6rem'
							mb='4rem'
						>
							{props.title}
						</Heading>

						{props.customHeader}

					</HStack>
					{/* Title */}

					{/* Main window content */}
					<VStack
						as='main'
						w='100%'
						padding={props.removePadding ? '0' : '2rem'}
						backgroundColor='secondary'
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
	)
}
