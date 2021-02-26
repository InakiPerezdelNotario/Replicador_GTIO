FROM ubuntu

ENV PORT 8080
ENV WORKDIR /tmp/server

RUN mkdir ${WORKDIR}


RUN apt-get update
RUN apt-get install -y python
RUN apt-get install -y apt-utils
RUN apt install -y wget
RUN apt-get install -y nodejs
RUN apt-get install -y npm
RUN apt-get install -y build-essential libtool autoconf automake uuid-dev
RUN wget http://download.zeromq.org/zeromq-3.2.3.tar.gz
RUN tar xvzf zeromq-3.2.3.tar.gz
RUN /zeromq-3.2.3/configure
RUN make
RUN make install
RUN ldconfig


