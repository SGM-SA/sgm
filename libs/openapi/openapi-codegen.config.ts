import { defineConfig } from '@openapi-codegen/cli'
import {
	generateReactQueryComponents,
	generateSchemaTypes
} from '@openapi-codegen/typescript'

export default defineConfig({
	api: {
		from: {
			relativePath: './src/spec.yml',
			source: 'file',
		},
		outputDir: './src/generated',
		to: async (context) => {
      		// You can transform the `context.openAPIDocument` here, can be useful to remove internal routes or fixing some known issues in the specs ;)

			const filenamePrefix = 'api'
			
			// Generate all the schemas types (components & responses)
			const { schemasFiles } = await generateSchemaTypes(context, {
				filenamePrefix,
			})

			// Generate all react-query hooks
			await generateReactQueryComponents(context, {
				filenamePrefix,
				schemasFiles,
			})
		},
	},
})
