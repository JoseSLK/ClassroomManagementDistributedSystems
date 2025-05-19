
FROM postgres:15-alpine

ARG POSTGRES_USER=dtic_admin
ARG POSTGRES_PASSWORD=dtic_secret_password
ARG POSTGRES_DB=prestamos_aulas_dtic

ENV POSTGRES_USER=${POSTGRES_USER}
ENV POSTGRES_PASSWORD=${POSTGRES_PASSWORD}
ENV POSTGRES_DB=${POSTGRES_DB}

COPY init.sql /docker-entrypoint-initdb.d/

EXPOSE 5432

# CMD ["postgres"]