# playwright-api-suite

Combined test automation suite covering **API testing** and **UI testing** (Playwright), with **Allure reporting** and **Docker** support.

## Tech Stack

- [Playwright](https://playwright.dev/) v1.63 — browser-based UI tests (Chromium, Firefox, WebKit)
- API tests via Playwright's `request` fixture
- Allure reporting (`allure-playwright` + `allure-commandline`)
- Docker packaging (official `mcr.microsoft.com/playwright` base image)

## Project Structure

```
├── tests/
│   ├── api/          # API lifecycle tests
│   └── ui/           # UI tests (Login, Add to Cart, Checkout, Smoke...)
├── Pages/            # Page Object Models
├── testdata/         # JSON test data
├── playwright.config.js
├── package.json
└── Dockerfile
```

## Getting Started

```bash
npm install
npx playwright install
```

### Run tests

```bash
npm run test:api    # API tests only
npm run test:ui     # UI tests only
npm run test:all    # full suite (API + UI, all browsers)
```

### Allure report

```bash
npm run allure:report   # generate + open the Allure report
```

### Docker

```bash
docker build -t playwright-tests .
docker run --rm playwright-tests
```

Runs the full suite inside the container and generates the Allure report.

## CI

GitHub Actions workflow (`.github/workflows/playwright.yml`) runs the suite on push/PR and uploads both the Playwright and Allure reports as artifacts.