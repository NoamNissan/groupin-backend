###Local DB setup

In here you setup a docker container running mysql server

you do it like this:
```bash
$ sudo node setup.js start
```
This script takes a few seconds since it downloads the mysql image
and then configures it a little.

you also have stop, restart and delete commands on the same script

I know it's hacky and stupid but I did not sit down to learn Dockerfile, only node
