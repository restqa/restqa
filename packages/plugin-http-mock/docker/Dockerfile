FROM node:18


WORKDIR /stubby

RUN openssl req -x509 -nodes -days 365 \
    -subj  "/C=CA/ST=QC/O=Company Inc/CN=example.com" \
    -newkey rsa:2048 -keyout key.pem \
    -out cert.pem;

RUN npm init -y
RUN npm i stubby glob yaml

COPY index.js /stubby

EXPOSE 7443 8882 8889

CMD node index.js
