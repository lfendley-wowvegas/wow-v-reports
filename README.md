# Allure Reports for WOW Vegas Test Scripts

This repository contains Allure Reports for the WOW Vegas automated test scripts. Allure is a flexible, lightweight multi-language test reporting tool. It helps you create comprehensive, attractive, and easy-to-understand reports for your automated tests.

## Features

- **Detailed Test Reports**: Provides a visual representation of the test execution.
- **Flexible Configuration**: Supports various customization options.
- **Comprehensive Insights**: View passed, failed, skipped, and broken tests in one place.

## Prerequisites

- Node.js.
- Allure CLI installed globally on your system.
- Test scripts set up for WOW Vegas.

## Getting Started

1. **Clone this Repository**:
   ```bash
   git clone https://github.com/lfendley-wowvegas/wow-v-reports.git
   ```

2. **Run Test Scripts**:
   Execute the test scripts for WOW Vegas to generate raw test result data.
   npx playwright test

4. **Generate Allure Reports**:
   Use the Allure CLI to generate the report from the test results.
   ```bash
   allure generate [results-dir] -o [report-dir]
   allure open [report-dir]
   ```

5. **View Reports**:
   Open the generated report in a browser to explore detailed test metrics and insights.
