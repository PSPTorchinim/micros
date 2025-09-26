FROM grafana/promtail:latest

ARG PROMTAIL_CONFIG_FILE=/etc/promtail/promtail.yaml

ENV PROMTAIL_CONFIG_FILE=${PROMTAIL_CONFIG_FILE}

HEALTHCHECK --interval=10s --timeout=10s --retries=5 \
  CMD curl -f http://localhost:9080/ready || exit 1

EXPOSE 9080

CMD ["-config.file=/etc/promtail/promtail.yaml"]