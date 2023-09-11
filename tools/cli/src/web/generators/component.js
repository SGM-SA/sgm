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
                name: 'type',
                message: 'What is the type of the component?',
                choices: [
                    'shared',
                    'modules',
                    'layouts',
                ]
            },
            {
                type: 'list',
                name: 'category',
                message: 'What is the category of the component?',
                when: (answers) => answers.type !== 'layouts',
                choices: (answers) => {

                    const categories = fs.readdirSync(`${basePath.web}/src/components/${answers.type}`).filter(file => fs.statSync(`${basePath.web}/src/components/${answers.type}/${file}`).isDirectory())
                    
                    return [
                        ...categories,
                        new plop.inquirer.Separator(),
                        'No Category'
                    ]
                },

            }
        ],

        actions: [
            {
                type: 'add',
                path: `${basePath.web}/src/components/{{camelCase type}}/{{#ifNotEquals category "No Category" }}{{category}}/{{/ifNotEquals}}{{pascalCase name}}.tsx`,
                templateFile: 'templates/component.hbs',
            },
            {
                type: 'append',
                path: `${basePath.web}/src/components/{{camelCase type}}/index.ts`,
                template: 'export * from \'./{{#ifNotEquals type "layouts"}}{{#ifNotEquals category "No Category" }}{{category}}/{{/ifNotEquals}}{{/ifNotEquals}}{{pascalCase name}}\'',
            }
        ]
    })
}