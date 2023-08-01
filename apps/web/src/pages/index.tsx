import { useApiClientsList } from "@sgm/openapi"
import { DashboardLayout } from "../components/layouts"

const HomePage = () => {

	const { data } = useApiClientsList({})

	return <>
		<DashboardLayout 
			title="Homepage"
		>
			<h1>Home - Basic</h1>
			<p>{JSON.stringify(data)}</p>

		</DashboardLayout>
	</>
}

export default HomePage