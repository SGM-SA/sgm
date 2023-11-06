const { basePath } = require('../../config')

module.exports = (plop) => {

    plop.setHelper('ifEquals', function(arg1, arg2, options) {
        return (arg1 === arg2) ? options.fn(this) : options.inverse(this);
    })
    
    plop.setGenerator('page', {

        description: 'Create a new page',
        
        prompts: [
            {
                type: 'input',
                name: 'route',
                message: 'What is the route of your page?',
            },
            {
                type: 'input',
                name: 'name',
                message: 'What should be the name of this page\'s component?',
            },
        ],

        actions: (answers) => {

            if (answers.route.startsWith('/')) answers.route = answers.route.substring(1)

            const actions = [
                {
                    type: 'add',
                    path: `${basePath.web}/src/pages/{{route}}.tsx`,
                    templateFile: 'templates/page.hbs',
                }
            ]

            return actions
        }
    })
}