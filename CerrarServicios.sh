docker stop proyecto_replicacion_replicador_1 || true
docker rm proyecto_replicacion_replicador_1 || true

docker stop replicador_gtio_main_kong_1 || true
docker rm replicador_gtio_main_kong_1 || true

docker stop replicador_gtio_main_kong-database_1 || true
docker rm replicador_gtio_main_kong-database_1 || true

docker network rm kong-ee-net || true
