#!/bin/bash

server=''
name='admctism'
port=''
user=''
pub_key=''
nodeport=''

rm -rf build
npm run build
ssh -p ${port} -i ${pub_key} -l ${user} ${server} "rm -rf build"
scp -P ${port} -i ${pub_key} -r build ${user}@${server}:.
ssh -p ${port} -i ${pub_key} -l ${user} ${server} "killall node"
ssh -p ${port} -i ${pub_key} -l ${user} ${server} "rm -rf ${name}"
ssh -p ${port} -i ${pub_key} -l ${user} ${server} "mv build ${name}"
ssh -p ${port} -i ${pub_key} -l ${user} ${server} "cd ${name} && serve -s . -l ${nodeport}"
