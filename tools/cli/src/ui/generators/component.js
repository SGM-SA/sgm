const fs = require('fs')
const { basePath } = require('../../config')

module.exports = (plop) => {
    
    plop.setHelper('ifNotEquals', function(arg1, arg2, options) {
        return (arg1 !== arg2) ? options.fn(this) : options.inverse(this);
    })

    plop.setGenerator('component', {

        description: 'Create a new component',
        
        prompts: [
            {
                type: 'input',
                name: 'name',
                message: 'What is the name of your component?',
            },
            {
                type: 'list',
                name: 'category',
                message: 'What is the category of the component?',
                when: (answers) => answers.type !== 'layouts',
                choices: (answers) => {

                    const categories = fs.readdirSync(`${basePath.ui}/src/ui`).filter(file => fs.statSync(`${basePath.ui}/src/ui/${file}`).isDirectory())
                    
                    return [
                        ...categories
                    ]
                },
            }
        ],

        actions: [
            {
                type: 'add',
                path: `${basePath.ui}/src/ui/{{camelCase category}}/{{pascalCase name}}/{{pascalCase name}}.tsx`,
                templateFile: 'templates/component.hbs',
            },
            {
                type: 'add',
                path: `${basePath.ui}/src/ui/{{camelCase category}}/{{pascalCase name}}/{{pascalCase name}}.stories.tsx`,
                templateFile: 'templates/stories.hbs',
            },
            {
                type: 'append',
                path: `${basePath.ui}/src/ui/index.ts`,
                template: 'export * from \'./{{camelCase category}}/{{pascalCase name}}/{{pascalCase name}}\'',
            }
        ]
    })
}