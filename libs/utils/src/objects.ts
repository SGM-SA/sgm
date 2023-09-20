import { DeepKeys } from "@tanstack/react-table"

type AnyObject = {
    [key: string]: AnyObject
}
  
export const createObjectFromPath = <TData>(path: DeepKeys<TData>, newValue: any): Partial<TData> => {

	const segments = (path as string).split('.')
	const result: AnyObject = {}

	let currentObject = result

	for (let i = 0; i < segments.length; i++) {

		const segment = segments[i]
		currentObject[segment] = {}

		if (i === segments.length - 1) {
			// Assign newValue to the last field
			currentObject[segment] = newValue
		} else {
			// Move to the next level in the object
			currentObject = currentObject[segment]
		}
	}

	return result as Partial<TData>
}