import yaml
import sys
from pathlib import Path

def get_port(svc, default):
    return svc.get('nodePort', default)

def get_mount(svc, key, default_path, default_mount):
    host = svc.get(key, default_path)
    if host:
        return f"{host}:{default_mount}"
    return None

def service_block(svc, default_port, default_mounts):
    lines = []
    lines.append(f"  {svc['name']}:")
    lines.append(f"    image: {svc['image']}")
    lines.append(f"    restart: unless-stopped")
    if 'nodePort' in svc:
        lines.append(f"    ports:")
        lines.append(f"      - \"{svc['nodePort']}:{default_port}\"")
    mounts_found = []
    for mount in default_mounts:
        m = get_mount(svc, mount['host_key'], mount['default_host'], mount['default_mount'])
        if m:
            mounts_found.append(m)
    if default_mounts:
        if mounts_found:
            lines.append(f"    volumes:")
            for m in mounts_found:
                lines.append(f"      - {m}")
        else:
            lines.append(f"    volumes: []")
    return "\n".join(lines)

def main():
    charts_dir = sys.argv[1] if len(sys.argv) > 1 else "charts"
    ix_values_file = Path(charts_dir) / "ix-values.yaml"
    output_file = Path(charts_dir) / "templates" / "docker-compose.yaml"

    with open(ix_values_file, "r") as f:
        values = yaml.safe_load(f)

    services = []

    # MongoDB
    for svc in values.get("mongodb", []):
        mounts = [
            {"host_key": "hostPathData", "default_host": "/mnt/truenas/mongodb-data", "default_mount": "/data/db"},
            {"host_key": "hostPathConfig", "default_host": "/mnt/truenas/mongodb-config", "default_mount": "/data/configdb"},
        ]
        services.append(service_block(svc, 27017, mounts))

    # Postgres
    for svc in values.get("postgres", []):
        mounts = [
            {"host_key": "hostPath", "default_host": "/mnt/truenas/strapi-db-data", "default_mount": "/var/lib/postgresql/data"},
        ]
        services.append(service_block(svc, 5432, mounts))

    # RabbitMQ
    for svc in values.get("rabbitmq", []):
        mounts = [
            {"host_key": "hostPath", "default_host": "/mnt/truenas/rabbitmq-data", "default_mount": "/var/lib/rabbitmq"},
        ]
        services.append(service_block(svc, 5672, mounts))

    # Redis
    for svc in values.get("redis", []):
        mounts = [
            {"host_key": "hostPath", "default_host": "/mnt/truenas/redis-data", "default_mount": "/data"},
        ]
        services.append(service_block(svc, 6379, mounts))

    # SQL Server
    for svc in values.get("sqlserver", []):
        mounts = [
            {"host_key": "hostPath", "default_host": "/mnt/truenas/sqlserver-data", "default_mount": "/var/opt/mssql"},
        ]
        services.append(service_block(svc, 1433, mounts))

    # Strapi
    for svc in values.get("strapi", []):
        mounts = [
            {"host_key": "hostPath", "default_host": "/mnt/truenas/strapi-app", "default_mount": "/srv/app"},
        ]
        services.append(service_block(svc, 1337, mounts))

    # Microservices
    for svc in values.get("microservices", []):
        mounts = []
        services.append(service_block(svc, 8080, mounts))

    # Microfrontends
    for svc in values.get("microfrontends", []):
        mounts = []
        services.append(service_block(svc, 3000, mounts))

    # Compose file
    compose = "version: '3.7'\nservices:\n" + "\n".join(services) + "\n"

    output_file.parent.mkdir(parents=True, exist_ok=True)
    with open(output_file, "w") as f:
        f.write(compose)

    print(f"Generated {output_file}")

if __name__ == "__main__":
    main()