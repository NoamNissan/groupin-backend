#!/usr/bin/env node
const yargs = require('yargs');
const os = require('os');
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const env = process.env.NODE_ENV || 'development';
const config = require('../config/config.js')[env];
const server_config = require('../config/server_config.js')[env];


if(os.userInfo().uid != 0) {
    throw Error("must run this as root");
}

function startServer() {
    const CMD1 = 'docker run --name='+ server_config.container_name +
                 ' -p ' + config.host +':' + config.port +':3306/tcp' +
                 ' -e MYSQL_ROOT_PASSWORD='+ server_config.root_password +
                 ' -d ' + server_config.docker_image;

    const CMD2 = 'docker exec '+ server_config.container_name +' /bin/bash -c "' +
        'echo \\"CREATE USER '+ config.username +' IDENTIFIED BY \''+ config.password +'\';'+
        'GRANT ALL PRIVILEGES ON *.* TO \''+ config.username +'\'@\'%\';\\"'+
        '| mysql -u root -p'+ server_config.root_password + '"';

    console.log('starting the server');
    exec(CMD1).
        then(() => {
            console.log('Now it needs to sleep for 60 seconds');
            return new Promise((resolve) => setTimeout(resolve, 60000))

        }).
        then(() => {
            return exec(CMD2);
        }).
        then((out) => {
            console.log('server is up and running');
        }).
        catch((err) => {
            if(err.stderr.includes('is already in use by container')) {
                console.log('container is already created. starting the existing container')
                return exec('docker start '+ server_config.container_name);
            }
            else {
                console.log('container setup has failed. please contact developer with the following error info:');
                console.log(err);
            }
        });
}

function stopServer() {
    console.log('stopping the server');
    const CMD1 = 'docker stop '+ server_config.container_name;
    return exec(CMD1);
}

function restartServer() {
    console.log('restarting the server');
    CMD1 = 'docker start '+ server_config.container_name
    stopServer().
    then(() => {
        console.log('starting server');
        return exec(CMD1);
    });

}

function deleteServer() {
    console.log('Stopping Deleting the server');
    CMD1 = 'docker rm '+ server_config.container_name;
    stopServer().then(() => exec(CMD1));
}

function statusServer() {
    CMD = 'docker ps';
    exec(CMD).then((out) => {
        console.log(out.stdout);
    });
}

yargs.command({
    command : 'start',
    describe : 'Start the DB',
    handler : startServer,
});

yargs.command({
    command : 'stop',
    describe: 'Stop the DB',
    handler : stopServer,
});

yargs.command({
    command : 'restart',
    describe : 'Restart the DB',
    handler : restartServer,
});

yargs.command({
    command : 'delete',
    describe : 'Delete the existing DB server in order to create a new one',
    handler : deleteServer,
});

yargs.command({
    command : 'status',
    describe : 'Display the status of the server',
    handler : statusServer,
});

yargs.argv;