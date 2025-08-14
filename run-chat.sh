docker stop $(docker ps -a -q)
docker rm $(docker ps -a -q)
docker images purge
docker system prune -a
docker-compose -f Docker/chat-composer.yml up --build --no-cache