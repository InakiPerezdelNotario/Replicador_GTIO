FROM ubuntu
ENV PORT 8080
ENV WORKDIR /tmp/server
RUN mkdir ${WORKDIR}
COPY Proyecto_Replicacion ${WORKDIR}
ENV REP /tmp/server/Proyecto_Replicacion
RUN apt-get update
RUN apt-get install -y nodejs
RUN apt-get install -y npm
RUN npm install zeromq@5
RUN npm rebuild

