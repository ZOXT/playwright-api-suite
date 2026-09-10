FROM mcr.microsoft.com/playwright:v1.63.0-jammy

WORKDIR /app

# Install Java (required by the Allure CLI report generator)
RUN apt-get update \
    && apt-get install -y --no-install-recommends openjdk-17-jre-headless \
    && rm -rf /var/lib/apt/lists/*

ENV JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64
ENV PATH="${JAVA_HOME}/bin:${PATH}"

# Install npm dependencies (browser binaries are already in the base image)
COPY package.json package-lock.json ./
RUN npm ci

# Copy the project source
COPY . .

# Ensure output folders exist
RUN mkdir -p allure-results allure-report

# Run API + UI tests, then build the Allure report
CMD ["sh", "-c", "npx playwright test && npx allure generate allure-results --clean -o allure-report"]