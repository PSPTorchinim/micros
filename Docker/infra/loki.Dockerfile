FROM grafana/loki:3.3.2

USER root
RUN apt-get update && apt-get install -y curl
USER root

COPY Docker/init/loki/loki-config.yml /etc/loki/local-config.yaml
EXPOSE 3100

HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
  CMD curl -fsS http://127.0.0.1:3100/ready || exit 1

ENTRYPOINT ["/usr/bin/loki"]
CMD ["-config.file=/etc/loki/local-config.yaml"]
