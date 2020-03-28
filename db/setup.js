#!/usr/bin/env node
const yargs = require('yargs');
const os = require('os');
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const config = require('./config.js');


if(os.userInfo().uid != 0) {
    throw Error("must run this as root");
}

function startServer() {
    const CMD1 = 'docker run --name='+ config.DB_CONTAINER +
                 ' -p ' + config.DB_HOST +':' + config.DB_PORT +':3306/tcp' +
                 ' -e MYSQL_ROOT_PASSWORD='+ config.DB_ROOT_PASSWORD +
                 ' -d ' + config.DB_DOCKER_IMAGE;

    const CMD2 = 'docker cp touchups.sql '+ config.DB_CONTAINER +':/';
    const CMD3 = 'docker exec '+ config.DB_CONTAINER +' /bin/bash -c "' +
        'echo \\"CREATE DATABASE IF NOT EXISTS '+ config.DB_NAME +';'+
        'CREATE USER '+ config.DB_USER +' IDENTIFIED BY \''+ config.DB_PASSWORD +'\';'+
        'GRANT ALL PRIVILEGES ON *.* TO \''+ config.DB_USER +'\'@\'%\';\\"'+
        '| mysql -u root -p'+ config.DB_ROOT_PASSWORD + '"';

    console.log('starting the server');
    exec(CMD1).
        then((out) =>  {
            return exec(CMD2)
        }).
        then((out) => {
            console.log('Now it needs to sleep for 60 seconds');
            return new Promise((resolve) => setTimeout(resolve, 60000))

        }).
        then(() => {
            return exec(CMD3)
        }).
        then((out) => {
            console.log('server is up and running');
        }).
        catch((err) => {
            if(err.stderr.includes('is already in use by container')) {
                console.log('container is already created. starting the existing container')
                return exec('docker start '+ config.DB_CONTAINER);
            }
            else {
                console.log(err);
            }
        });
}

function stopServer() {
    console.log('stopping the server');
    const CMD1 = 'docker stop '+ config.DB_CONTAINER;
    return exec(CMD1);
}

function restartServer() {
    console.log('restarting the server');
    CMD1 = 'docker start '+ config.DB_CONTAINER
    stopServer().
    then(() => {
        console.log('starting server');
        return exec(CMD1);
    });

}

function deleteServer() {
    console.log('Stopping Deleting the server');
    CMD1 = 'docker rm '+ config.DB_CONTAINER;
    stopServer().then(() => exec(CMD1));
}

function statusServer() {
    CMD = 'docker ps';
    exec(CMD);
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