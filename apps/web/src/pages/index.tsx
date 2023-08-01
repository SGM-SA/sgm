import { useApiClientsList } from "@sgm/openapi"

const HomePage = () => {

	const { data } = useApiClientsList({})

	return <>
		<h1>Home - Basic</h1>
		<p>{JSON.stringify(data)}</p>
	</>
}

export default HomePage