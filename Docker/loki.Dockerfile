FROM grafana/loki:latest

ARG LOKI_CONFIG_FILE=/etc/loki/local-config.yaml

ENV LOKI_CONFIG_FILE=${LOKI_CONFIG_FILE}

HEALTHCHECK --interval=10s --timeout=10s --retries=5 \
  CMD curl -f http://localhost:3100/ready || exit 1

EXPOSE 3100

CMD ["-config.file=/etc/loki/local-config.yaml"]