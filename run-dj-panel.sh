docker stop $(docker ps -a -q)
docker system prune -af --volumes
docker-compose -f Docker/dj-panel-composer.yml up --build