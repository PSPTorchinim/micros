FROM mcr.microsoft.com/mssql/server:2022-latest

ARG DATABASE_PASSWORD_SQLSERVER

ENV ACCEPT_EULA=Y
ENV MSSQL_SA_PASSWORD=$DATABASE_PASSWORD_SQLSERVER

USER mssql

HEALTHCHECK --interval=10s --timeout=15s --retries=10 CMD /opt/mssql-tools18/bin/sqlcmd -U sa -P "$MSSQL_SA_PASSWORD" -Q "SELECT 1" -C || exit 1

EXPOSE 1433