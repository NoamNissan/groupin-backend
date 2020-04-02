module.exports = {
    development: {
        root_password: 'p@sswordvery$ecret',
        container_name: 'groupin-mysql',
        docker_image: 'mysql/mysql-server:5.7',
        session_secret: 'groupin-session-salt-very-very-secret'
    },
    test: {
        root_password: 'p@sswordvery$ecret',
        container_name: 'groupin-mysql',
        docker_image: 'mysql/mysql-server:5.7',
        session_secret: 'groupin-session-salt-very-very-secret'
    },

    production: {
        root_password: process.env.DB_ROOT_PASSWORD,
        container_name: process.env.DB_CONTAINER_NAME,
        docker_image: process.env.DB_DOCKER_IMAGE,
        session_secret: process.env.SESSION_SECRET
    }
};
