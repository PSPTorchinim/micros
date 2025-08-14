docker stop $(docker ps -a -q)
docker-compose -f Docker/dj-panel-composer.yml up --build