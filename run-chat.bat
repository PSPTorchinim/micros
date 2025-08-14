@REM docker stop $(docker ps -a -q)
@REM docker rm $(docker ps -a -q)
@REM docker images purge
@REM docker system prune -a
docker-compose -f Docker/chat-composer.yml up --build --no-cache