###Local DB setup

In here you setup a docker container running mysql server

you do it like this:
```bash
$ sudo node setup.js
```
This script takes a few seconds since it downloads the mysql image
and then configures it a little.

I know it's hacky and stupid but I did not sit down to learn Dockerfile, only node
