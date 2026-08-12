FROM node:latest AS storefront
WORKDIR /usr/src/onlineshop/app/react-app
COPY react-app .
RUN --mount=type=cache,target=/root/.npm npm install
RUN npm run build

FROM maven:latest AS appserver
WORKDIR /usr/src/onlineshop
COPY pom.xml .
RUN --mount=type=cache,target=/root/.m2 \
mvn -B -f pom.xml -s /usr/share/maven/ref/settings-docker.xml dependency:resolve
COPY . .
RUN --mount=type=cache,target=/root/.m2 \
mvn -B -s /usr/share/maven/ref/settings-docker.xml package -DskipTests

FROM eclipse-temurin:8-jre-alpine
RUN adduser -Dh /home/gordon gordon
WORKDIR /static
COPY --from=storefront /usr/src/onlineshop/app/react-app/build/ .
WORKDIR /app
COPY --from=appserver /usr/src/onlineshop/target/OnlineShop-0.0.1-SNAPSHOT.jar .
ENTRYPOINT ["java", "-jar", "/app/OnlineShop-0.0.1-SNAPSHOT.jar"]
CMD ["--spring.profiles.active=postgres"]
