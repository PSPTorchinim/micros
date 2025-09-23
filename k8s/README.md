# Kubernetes Deployment - DJ Beat Blaster Platform

This directory contains Kubernetes manifests and Helm charts for deploying the DJ Beat Blaster microservices platform to Kubernetes clusters.

## 📋 Overview

The Kubernetes configuration provides:

- **Scalable Deployment**: Horizontal pod autoscaling for all services
- **High Availability**: Multi-replica deployments with load balancing
- **Service Discovery**: Native Kubernetes service discovery
- **Configuration Management**: ConfigMaps and Secrets for environment variables
- **Persistent Storage**: Persistent Volume Claims for databases
- **Ingress Control**: External access management with SSL/TLS termination

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Ingress Layer                        │
│  ┌─────────────────┐    ┌─────────────────┐            │
│  │  Nginx Ingress  │    │   Cert Manager  │            │
│  │   Controller    │    │   (SSL/TLS)     │            │
│  └─────────────────┘    └─────────────────┘            │
└─────────────────────────────────────────────────────────┘
                             │
┌─────────────────────────────────────────────────────────┐
│                   Service Layer                         │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐              │
│  │API Gateway│  │DJ Panel  │  │Strapi CMS│              │
│  │ Service  │  │ Service  │  │ Service  │              │
│  └──────────┘  └──────────┘  └──────────┘              │
└─────────────────────────────────────────────────────────┘
                             │
┌─────────────────────────────────────────────────────────┐
│                Application Layer                        │
│ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐   │
│ │Identity  │ │  Music   │ │Equipment │ │  Party   │   │
│ │   Pod    │ │   Pod    │ │   Pod    │ │   Pod    │   │
│ └──────────┘ └──────────┘ └──────────┘ └──────────┘   │
│ ┌──────────┐ ┌──────────┐ ┌──────────┐               │
│ │ Company  │ │Documents │ │ Mailing  │               │
│ │   Pod    │ │   Pod    │ │   Pod    │               │
│ └──────────┘ └──────────┘ └──────────┘               │
└─────────────────────────────────────────────────────────┘
                             │
┌─────────────────────────────────────────────────────────┐
│                 Data Layer                              │
│ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐   │
│ │SQL Server│ │ MongoDB  │ │PostgreSQL│ │  Redis   │   │
│ │StatefulSet│ │StatefulSet│ │StatefulSet│ │StatefulSet│ │
│ └──────────┘ └──────────┘ └──────────┘ └──────────┘   │
└─────────────────────────────────────────────────────────┘
```

## 📁 Directory Structure

```
k8s/
├── Chart.yaml              # Helm chart metadata
├── values.yaml            # Default configuration values
├── templates/
│   ├── Deployments/       # Application deployments
│   │   ├── microservice.yaml
│   │   ├── microfrontend.yaml
│   │   ├── strapi.yaml
│   │   ├── sqlserver.yaml
│   │   ├── mongodb.yaml
│   │   ├── postgres.yaml
│   │   ├── redis.yaml
│   │   └── rabbitmq.yaml
│   ├── Services/          # Kubernetes services
│   │   ├── microservice.yaml
│   │   ├── microfrontend.yaml
│   │   ├── strapi.yaml
│   │   ├── sqlserver.yaml
│   │   ├── mongodb.yaml
│   │   ├── postgres.yaml
│   │   ├── redis.yaml
│   │   └── rabbitmq.yaml
│   ├── PVC/               # Persistent Volume Claims
│   │   ├── sqlserver.yaml
│   │   ├── mongodb.yaml
│   │   ├── postgres.yaml
│   │   ├── redis.yaml
│   │   └── rabbitmq.yaml
│   ├── ConfigMaps/        # Configuration management
│   ├── Secrets/           # Sensitive data management
│   ├── Ingress/          # External access configuration
│   └── HPA/              # Horizontal Pod Autoscaling
```

## 🚀 Deployment Guide

### Prerequisites

1. **Kubernetes Cluster** (v1.24+)

   - Local: Minikube, Kind, Docker Desktop
   - Cloud: EKS, GKE, AKS
   - On-premise: kubeadm, k3s

2. **Helm 3** (v3.8+)

   ```bash
   curl https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3 | bash
   ```

3. **kubectl** configured for your cluster
   ```bash
   kubectl version --client
   kubectl cluster-info
   ```

### Installation

#### 1. Deploy Infrastructure

```bash
# Add Helm repositories
helm repo add bitnami https://charts.bitnami.com/bitnami
helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx
helm repo update

# Install NGINX Ingress Controller
helm install ingress-nginx ingress-nginx/ingress-nginx \
  --namespace ingress-nginx \
  --create-namespace

# Install Cert Manager (for SSL)
kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.13.0/cert-manager.yaml
```

#### 2. Deploy Databases

```bash
# Deploy SQL Server
helm install sqlserver bitnami/mssqlserver \
  --namespace djbeatblaster \
  --create-namespace \
  --set auth.rootPassword="YourStrong@Passw0rd" \
  --set primary.persistence.size=50Gi

# Deploy MongoDB
helm install mongodb bitnami/mongodb \
  --namespace djbeatblaster \
  --set auth.rootPassword="password" \
  --set persistence.size=50Gi

# Deploy PostgreSQL
helm install postgresql bitnami/postgresql \
  --namespace djbeatblaster \
  --set auth.postgresPassword="strapi" \
  --set auth.database="strapi" \
  --set primary.persistence.size=20Gi

# Deploy Redis
helm install redis bitnami/redis \
  --namespace djbeatblaster \
  --set auth.enabled=false \
  --set master.persistence.size=10Gi

# Deploy RabbitMQ
helm install rabbitmq bitnami/rabbitmq \
  --namespace djbeatblaster \
  --set auth.username="guest" \
  --set auth.password="guest" \
  --set persistence.size=10Gi
```

#### 3. Deploy Application

```bash
# Install DJ Beat Blaster platform
helm install djbeatblaster . \
  --namespace djbeatblaster \
  --create-namespace \
  --values values.yaml
```

### Configuration Values

#### `values.yaml` Structure

```yaml
global:
  imageRegistry: "ghcr.io/psptorchinim"
  imagePullPolicy: IfNotPresent
  storageClass: "default"

environment: production

replicaCount:
  apigateway: 2
  identity: 2
  music: 3
  equipment: 2
  documents: 2
  company: 2
  party: 2
  mailing: 1
  frontend: 2
  strapi: 1

resources:
  apigateway:
    limits:
      cpu: 1000m
      memory: 512Mi
    requests:
      cpu: 500m
      memory: 256Mi

  identity:
    limits:
      cpu: 1000m
      memory: 512Mi
    requests:
      cpu: 500m
      memory: 256Mi

autoscaling:
  enabled: true
  minReplicas: 1
  maxReplicas: 10
  targetCPUUtilizationPercentage: 70
  targetMemoryUtilizationPercentage: 80

ingress:
  enabled: true
  className: nginx
  annotations:
    cert-manager.io/cluster-issuer: letsencrypt-prod
    nginx.ingress.kubernetes.io/ssl-redirect: "true"
  hosts:
    - host: api.djbeatblaster.com
      paths:
        - path: /
          pathType: Prefix
          service: apigateway
    - host: app.djbeatblaster.com
      paths:
        - path: /
          pathType: Prefix
          service: frontend
    - host: cms.djbeatblaster.com
      paths:
        - path: /
          pathType: Prefix
          service: strapi
  tls:
    - secretName: djbeatblaster-tls
      hosts:
        - api.djbeatblaster.com
        - app.djbeatblaster.com
        - cms.djbeatblaster.com

persistence:
  enabled: true
  sqlserver:
    size: 100Gi
    accessMode: ReadWriteOnce
  mongodb:
    size: 50Gi
    accessMode: ReadWriteOnce
  postgresql:
    size: 20Gi
    accessMode: ReadWriteOnce
  redis:
    size: 10Gi
    accessMode: ReadWriteOnce
  rabbitmq:
    size: 10Gi
    accessMode: ReadWriteOnce

secrets:
  database:
    sqlserver:
      password: "YourStrong@Passw0rd"
    mongodb:
      password: "password"
    postgresql:
      password: "strapi"

  jwt:
    key: "ProductionJWTKey123456789012345678901234567890"

  api:
    secureKey: "ProductionSecureKey123456789"
```

#### Environment-Specific Values

**Development** (`values-dev.yaml`):

```yaml
environment: development
replicaCount:
  apigateway: 1
  identity: 1
  music: 1
  # ... other services with 1 replica

autoscaling:
  enabled: false

ingress:
  hosts:
    - host: api-dev.djbeatblaster.com
    - host: app-dev.djbeatblaster.com
```

**Staging** (`values-staging.yaml`):

```yaml
environment: staging
replicaCount:
  apigateway: 2
  identity: 1
  music: 2
  # ... scaled for staging load

resources:
  # Reduced resources for staging
  identity:
    limits:
      cpu: 500m
      memory: 256Mi
```

## 🔧 Management Operations

### Deployment Operations

```bash
# Install/Upgrade
helm upgrade --install djbeatblaster . \
  --namespace djbeatblaster \
  --values values.yaml \
  --values values-production.yaml

# Rollback to previous version
helm rollback djbeatblaster 1 --namespace djbeatblaster

# View deployment status
helm status djbeatblaster --namespace djbeatblaster

# View deployment history
helm history djbeatblaster --namespace djbeatblaster
```

### Scaling Operations

```bash
# Scale specific service
kubectl scale deployment identity-api \
  --replicas=5 \
  --namespace djbeatblaster

# Enable autoscaling
kubectl autoscale deployment identity-api \
  --min=2 --max=10 --cpu-percent=70 \
  --namespace djbeatblaster

# View HPA status
kubectl get hpa --namespace djbeatblaster
```

### Configuration Management

```bash
# Update ConfigMap
kubectl create configmap app-config \
  --from-file=appsettings.json \
  --namespace djbeatblaster \
  --dry-run=client -o yaml | kubectl apply -f -

# Update Secret
kubectl create secret generic app-secrets \
  --from-literal=jwt-key="new-jwt-key" \
  --namespace djbeatblaster \
  --dry-run=client -o yaml | kubectl apply -f -

# Restart deployments to pick up new config
kubectl rollout restart deployment/identity-api --namespace djbeatblaster
```

## 📊 Monitoring & Observability

### Resource Monitoring

```bash
# View resource usage
kubectl top nodes
kubectl top pods --namespace djbeatblaster

# View events
kubectl get events --namespace djbeatblaster --sort-by='.lastTimestamp'

# View logs
kubectl logs -l app=identity-api --namespace djbeatblaster -f
```

### Health Checks

```bash
# Check pod health
kubectl get pods --namespace djbeatblaster -o wide

# Check service endpoints
kubectl get endpoints --namespace djbeatblaster

# Test service connectivity
kubectl exec -it deployment/identity-api --namespace djbeatblaster -- \
  curl http://music-api:8080/healthz/live
```

### Prometheus & Grafana Setup

```bash
# Install Prometheus Operator
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm install prometheus prometheus-community/kube-prometheus-stack \
  --namespace monitoring \
  --create-namespace

# Access Grafana
kubectl port-forward svc/prometheus-grafana 3000:80 --namespace monitoring
```

## 🔒 Security Configuration

### Network Policies

```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: djbeatblaster-network-policy
spec:
  podSelector:
    matchLabels:
      app.kubernetes.io/name: djbeatblaster
  policyTypes:
    - Ingress
    - Egress
  ingress:
    - from:
        - namespaceSelector:
            matchLabels:
              name: djbeatblaster
  egress:
    - to:
        - namespaceSelector:
            matchLabels:
              name: djbeatblaster
```

### RBAC Configuration

```yaml
apiVersion: v1
kind: ServiceAccount
metadata:
  name: djbeatblaster-sa
  namespace: djbeatblaster
---
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  name: djbeatblaster-role
  namespace: djbeatblaster
rules:
  - apiGroups: [""]
    resources: ["pods", "services"]
    verbs: ["get", "list", "watch"]
---
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  name: djbeatblaster-rolebinding
  namespace: djbeatblaster
subjects:
  - kind: ServiceAccount
    name: djbeatblaster-sa
roleRef:
  kind: Role
  name: djbeatblaster-role
  apiGroup: rbac.authorization.k8s.io
```

### Pod Security Standards

```yaml
apiVersion: v1
kind: Namespace
metadata:
  name: djbeatblaster
  labels:
    pod-security.kubernetes.io/enforce: restricted
    pod-security.kubernetes.io/audit: restricted
    pod-security.kubernetes.io/warn: restricted
```

## 📦 Storage Management

### Persistent Volume Claims

```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: sqlserver-data
spec:
  accessModes:
    - ReadWriteOnce
  storageClassName: fast-ssd
  resources:
    requests:
      storage: 100Gi
```

### Backup Strategy

```bash
# Create volume snapshots
kubectl apply -f - <<EOF
apiVersion: snapshot.storage.k8s.io/v1
kind: VolumeSnapshot
metadata:
  name: sqlserver-snapshot-$(date +%Y%m%d-%H%M%S)
  namespace: djbeatblaster
spec:
  source:
    persistentVolumeClaimName: sqlserver-data
  volumeSnapshotClassName: csi-snapclass
EOF

# Schedule regular backups with CronJob
kubectl apply -f backup-cronjob.yaml
```

## 🚨 Troubleshooting

### Common Issues

#### Pod Startup Issues

```bash
# Check pod status and events
kubectl describe pod <pod-name> --namespace djbeatblaster

# View pod logs
kubectl logs <pod-name> --namespace djbeatblaster --previous

# Check resource constraints
kubectl get events --field-selector involvedObject.name=<pod-name> --namespace djbeatblaster
```

#### Service Discovery Issues

```bash
# Test DNS resolution
kubectl exec -it <pod-name> --namespace djbeatblaster -- nslookup identity-api

# Check service endpoints
kubectl get endpoints identity-api --namespace djbeatblaster

# Test service connectivity
kubectl exec -it <pod-name> --namespace djbeatblaster -- \
  curl http://identity-api:8080/healthz/live
```

#### Storage Issues

```bash
# Check PVC status
kubectl get pvc --namespace djbeatblaster

# View storage class
kubectl get storageclass

# Check volume mount issues
kubectl describe pod <pod-name> --namespace djbeatblaster | grep -A 10 "Volumes:"
```

#### Ingress Issues

```bash
# Check ingress controller
kubectl get pods --namespace ingress-nginx

# View ingress configuration
kubectl describe ingress djbeatblaster-ingress --namespace djbeatblaster

# Test SSL certificates
kubectl describe certificate djbeatblaster-tls --namespace djbeatblaster
```

### Debug Commands

```bash
# Enable debug logging
kubectl patch deployment identity-api \
  --namespace djbeatblaster \
  --patch '{"spec":{"template":{"spec":{"containers":[{"name":"identity-api","env":[{"name":"Logging__LogLevel__Default","value":"Debug"}]}]}}}}'

# Run debug pod
kubectl run debug --image=nicolaka/netshoot -it --rm --namespace djbeatblaster

# Check cluster resources
kubectl describe nodes
kubectl get events --all-namespaces --sort-by='.lastTimestamp'
```

## 🔄 CI/CD Integration

### GitHub Actions Workflow

```yaml
name: Deploy to Kubernetes
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Configure kubectl
        uses: azure/k8s-set-context@v1
        with:
          method: kubeconfig
          kubeconfig: ${{ secrets.KUBECONFIG }}

      - name: Deploy with Helm
        run: |
          helm upgrade --install djbeatblaster ./k8s \
            --namespace djbeatblaster \
            --values ./k8s/values-production.yaml \
            --set image.tag=${{ github.sha }}
```

### ArgoCD GitOps

```yaml
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: djbeatblaster
  namespace: argocd
spec:
  project: default
  source:
    repoURL: https://github.com/PSPTorchinim/micros
    targetRevision: HEAD
    path: k8s
    helm:
      valueFiles:
        - values.yaml
        - values-production.yaml
  destination:
    server: https://kubernetes.default.svc
    namespace: djbeatblaster
  syncPolicy:
    automated:
      prune: true
      selfHeal: true
```

## 🌐 Multi-Environment Setup

### Environment Promotion Pipeline

```bash
# Deploy to development
helm upgrade --install djbeatblaster . \
  --namespace djbeatblaster-dev \
  --values values-dev.yaml

# Promote to staging
helm upgrade --install djbeatblaster . \
  --namespace djbeatblaster-staging \
  --values values-staging.yaml

# Promote to production
helm upgrade --install djbeatblaster . \
  --namespace djbeatblaster-prod \
  --values values-production.yaml
```

### Blue-Green Deployment

```bash
# Deploy green environment
helm upgrade --install djbeatblaster-green . \
  --namespace djbeatblaster-prod \
  --values values-production.yaml \
  --set nameOverride="green"

# Switch traffic to green
kubectl patch service apigateway \
  --namespace djbeatblaster-prod \
  --patch '{"spec":{"selector":{"version":"green"}}}'

# Remove blue environment
helm uninstall djbeatblaster-blue --namespace djbeatblaster-prod
```

For additional information, refer to the [main README](../README.md) and [Docker documentation](../Docker/README.md).
