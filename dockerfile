# Stage 1: Build Angular/Ionic application
FROM node:18-slim AS build-stage

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Build the Ionic app
RUN npm run build

# Stage 2: Build Android APK
FROM openjdk:21-bullseye AS android-build

ENV ANDROID_SDK_ROOT=/sdk
ENV CMDLINE_TOOLS_VERSION=9477386
ENV CMDLINE_TOOLS_ZIP=commandlinetools-linux-${CMDLINE_TOOLS_VERSION}_latest.zip
ENV CMDLINE_TOOLS_DIR=${ANDROID_SDK_ROOT}/cmdline-tools

# Install SDK, tools, Gradle, etc.
RUN apt-get update && \
    DEBIAN_FRONTEND=noninteractive apt-get install -y --no-install-recommends \
    wget unzip git curl nodejs npm ca-certificates && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

# Install Node.js 18
RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash - && \
    apt-get install -y nodejs


RUN mkdir -p ${ANDROID_SDK_ROOT}/cmdline-tools && \
    curl -sSL https://dl.google.com/android/repository/commandlinetools-linux-11076708_latest.zip -o cmdline-tools.zip && \
    unzip cmdline-tools.zip -d ${ANDROID_SDK_ROOT}/cmdline-tools && \
    mv ${ANDROID_SDK_ROOT}/cmdline-tools/cmdline-tools ${ANDROID_SDK_ROOT}/cmdline-tools/latest && \
    rm cmdline-tools.zip


# Set environment and add tools to path
ENV PATH="${ANDROID_SDK_ROOT}/cmdline-tools/latest/bin:${ANDROID_SDK_ROOT}/platform-tools:${PATH}"
ENV JAVA_HOME=/usr/local/openjdk-17
ENV PATH="$JAVA_HOME/bin:$PATH"

# Accept Android SDK licenses and install SDK components
RUN yes | sdkmanager --licenses && \
    sdkmanager "platform-tools" "platforms;android-33" "build-tools;33.0.2"

# Copy Ionic project from build stage
COPY --from=build-stage /app /app
WORKDIR /app

# Install CLI tools
RUN npm install -g @ionic/cli @capacitor/cli @ionic/angular-toolkit @capacitor/android @capacitor/core

# Clean Gradle cache if exists
RUN rm -rf /root/.gradle/caches/

# Add Android platform, sync, and build APK
RUN rm -rf android

# Add Android platform
RUN npx cap add android

# Sync Capacitor with native platforms
RUN npx cap sync android

# Go to the Android project folder
WORKDIR /app/android

# Make sure gradlew is executable (in case it's not)
RUN chmod +x ./gradlew

# Upgrade Gradle wrapper (uses Kotlin DSL so make sure the version supports it)
RUN ./gradlew wrapper --gradle-version 8.5 --distribution-type=all

# Build the APK
RUN ./gradlew clean
RUN ./gradlew assembleDebug

# Stage 3: Output APK
FROM alpine AS output-stage

COPY --from=android-build /app/android/app/build/outputs/apk/debug/app-debug.apk /output/app-debug.apk

CMD ["cp", "/output/app-debug.apk", "/shared/app-debug.apk"]

