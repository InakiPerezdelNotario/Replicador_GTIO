FROM ubuntu
ENV PORT 8080
ENV WORKDIR /tmp/server
RUN mkdir ${WORKDIR}
COPY ./ ${WORKDIR}
ENV REP /tmp/server/Proyecto_Replicacion
RUN apt-get update
RUN apt-get install -y nodejs
RUN apt-get install -y npm
RUN apt-get install -y curl
RUN npm install zeromq@5
CMD cd /tmp/server/; nodejs InicializarKong.js
CMD cd /tmp/server/; sh /tmp/server/ejecucionTotal_contenedor.sh
