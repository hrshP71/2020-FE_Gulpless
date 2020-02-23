module.exports = {

    // the application
    application: {

        styles: {

            files: [
                '/application.less'
            ],

            concat: 'default.css'

        },

        scripts: {

            files: [
                // Bootstrap
                '/bootstrap/bootstrap.js',
                // Application
                '/application.js',
                //'/es2015.js'
            ],

            concat: 'default.js'

        }

    },

    // 3rd party components
    components: {

        styles: {

            files: [
                //'/package/src/dev.less'
                //'/package/src/production.css'
            ],

            concat: 'components.css'

        },

        scripts: {

            files: [
                //'/package/src/dev.js'
                //'/package/src/production.js'
            ],

            concat: 'components.js'

        }

    },

    // for production
    production: {



    }

};