# ================================
# STAGE 1 : BUILD
# ================================
FROM maven:3.9-eclipse-temurin-17 AS build

WORKDIR /app

# Copier le pom.xml en premier (pour profiter du cache Docker si les dépendances ne changent pas)
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copier le reste du code source
COPY src ./src

# Builder l'application (skip les tests pour accélérer le build, à activer si besoin)
RUN mvn clean package -DskipTests -B

# ================================
# STAGE 2 : RUNTIME
# ================================
FROM eclipse-temurin:17-jre-alpine

WORKDIR /app

# Créer un utilisateur non-root pour la sécurité
RUN addgroup -S spring && adduser -S spring -G spring
USER spring:spring

# Copier uniquement le jar généré depuis le stage de build
COPY --from=build /app/target/*.jar app.jar

# Le port sur lequel tourne PhosphOps (8087 selon ta config)
EXPOSE 8087

# Point d'entrée
ENTRYPOINT ["java", "-jar", "app.jar"]