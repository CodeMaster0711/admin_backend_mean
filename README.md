# API

Install Docker
=============
Tested versions
Docker 17.09.1-ce
Docker compose 1.17.1
Docker Machine 0.13.0



Start Server
============
Clone Repo 
run npm install
docker-compose up or docker-compose up -d

Note : If you are running it for the first time, you may need to run the command twice by cancelling the first command using Ctrl+C to get the DB server up and running correctly

To test apis, import the collection at node_app/Umbrella_api.postman_collection.json
and set envoirnment variable as http://dev.api.umbrella.localhost for development

To trigger protected APIs
set jwt_token value based on the login api

Import country settings for dev.
Log in to Portainer
select applicatiopn server, go into console and run 

/src/node_modules/.bin/sequelize db:migrate


To Refresh country setting in redis 
Login to redis server and run 
redis-cli flushall

Container Management
====================
http://dev.portainer.umbrella.localhost:9000/
Select Local and connect 


http://dev.adminer.umbrella.localhost:8080/
(Find the database server's IP address from portainer or docker ps command) or use mariadb as the host 

Username : root 
password : <blank>
databse: umbrella_dev_db



Prod/Stage Deployments Notes
======================
setup config_prod / config_stage 
Delete Secret routes
Delete Collection json 