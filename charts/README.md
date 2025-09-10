# djpanel

![Version: 1.0.0](https://img.shields.io/badge/Version-1.0.0-informational?style=flat-square) ![Type: application](https://img.shields.io/badge/Type-application-informational?style=flat-square) ![AppVersion: 1.0.0](https://img.shields.io/badge/AppVersion-1.0.0-informational?style=flat-square)

DJ Panel Microservices Stack

## Values

| Key                        | Type   | Default                                                               | Description |
| -------------------------- | ------ | --------------------------------------------------------------------- | ----------- |
| microfrontends[0].image    | string | `"ghcr.io/psptorchinim/micros/frontends/dj-panel:develop-latest"`     |             |
| microfrontends[0].name     | string | `"dj-panel"`                                                          |             |
| microfrontends[0].nodePort | int    | `8080`                                                                |             |
| microservices[0].image     | string | `"ghcr.io/psptorchinim/micros/services/companyapi:develop-latest"`    |             |
| microservices[0].name      | string | `"companyapi"`                                                        |             |
| microservices[1].image     | string | `"ghcr.io/psptorchinim/micros/services/djhostgateway:develop-latest"` |             |
| microservices[1].name      | string | `"djhostgateway"`                                                     |             |
| microservices[1].nodePort  | int    | `3000`                                                                |             |
| microservices[2].image     | string | `"ghcr.io/psptorchinim/micros/services/documentsapi:develop-latest"`  |             |
| microservices[2].name      | string | `"documentsapi"`                                                      |             |
| microservices[3].image     | string | `"ghcr.io/psptorchinim/micros/services/equipmentapi:develop-latest"`  |             |
| microservices[3].name      | string | `"equipmentapi"`                                                      |             |
| microservices[4].image     | string | `"ghcr.io/psptorchinim/micros/services/identityapi:develop-latest"`   |             |
| microservices[4].name      | string | `"identityapi"`                                                       |             |
| microservices[5].image     | string | `"ghcr.io/psptorchinim/micros/services/mailingapi:develop-latest"`    |             |
| microservices[5].name      | string | `"mailingapi"`                                                        |             |
| microservices[6].image     | string | `"ghcr.io/psptorchinim/micros/services/musicapi:develop-latest"`      |             |
| microservices[6].name      | string | `"musicapi"`                                                          |             |
| microservices[7].image     | string | `"ghcr.io/psptorchinim/micros/services/partyapi:develop-latest"`      |             |
| microservices[7].name      | string | `"partyapi"`                                                          |             |
| mongodb[0].image           | string | `"ghcr.io/psptorchinim/micros/infra/mongodb:develop-latest"`          |             |
| mongodb[0].name            | string | `"mongodb"`                                                           |             |
| mongodb[0].nodePort        | int    | `27017`                                                               |             |
| ports.apigateway           | int    | `3000`                                                                |             |
| ports.mongodb              | int    | `27017`                                                               |             |
| ports.postgres             | int    | `5432`                                                                |             |
| ports.rabbitmq             | int    | `5672`                                                                |             |
| ports.redis                | int    | `6379`                                                                |             |
| ports.sqlserver            | int    | `1433`                                                                |             |
| ports.strapi               | int    | `1337`                                                                |             |
| postgres[0].image          | string | `"ghcr.io/psptorchinim/micros/infra/postgres:develop-latest"`         |             |
| postgres[0].name           | string | `"strapi-db"`                                                         |             |
| postgres[0].nodePort       | int    | `5432`                                                                |             |
| rabbitmq[0].image          | string | `"ghcr.io/psptorchinim/micros/infra/rabbitmq:develop-latest"`         |             |
| rabbitmq[0].name           | string | `"rabbitmq"`                                                          |             |
| rabbitmq[0].nodePort       | int    | `5672`                                                                |             |
| redis[0].image             | string | `"ghcr.io/psptorchinim/micros/infra/redis:develop-latest"`            |             |
| redis[0].name              | string | `"redis"`                                                             |             |
| redis[0].nodePort          | int    | `6379`                                                                |             |
| sqlserver[0].image         | string | `"ghcr.io/psptorchinim/micros/infra/sqlserver:develop-latest"`        |             |
| sqlserver[0].name          | string | `"sqlserver"`                                                         |             |
| sqlserver[0].nodePort      | int    | `1433`                                                                |             |
| storage.microfrontend      | string | `"2Gi"`                                                               |             |
| storage.microservice       | string | `"2Gi"`                                                               |             |
| storage.mongodbConfig      | string | `"1Gi"`                                                               |             |
| storage.mongodbData        | string | `"5Gi"`                                                               |             |
| storage.postgres           | string | `"5Gi"`                                                               |             |
| storage.rabbitmq           | string | `"2Gi"`                                                               |             |
| storage.redis              | string | `"2Gi"`                                                               |             |
| storage.sqlserver          | string | `"10Gi"`                                                              |             |
| storage.strapi             | string | `"5Gi"`                                                               |             |
| strapi[0].image            | string | `"ghcr.io/psptorchinim/micros/infra/strapi:develop-latest"`           |             |
| strapi[0].name             | string | `"strapi"`                                                            |             |
| strapi[0].nodePort         | int    | `1337`                                                                |             |

---

Autogenerated from chart metadata using [helm-docs v1.14.2](https://github.com/norwoodj/helm-docs/releases/v1.14.2)
