# Mutual Fund Analysis Tool

## Project Overview

This project is designed to help users analyze and compare Indian mutual funds. It provides tools to calculate rolling returns and other key metrics, allowing for a comprehensive evaluation of fund performance. The application is built with an Angular frontend and a Python backend for data processing.

## Architecture

The application is composed of three main components:

*   **Angular Frontend:** The user interface is built with Angular. It allows users to select mutual funds, view performance data, and compare different funds.
*   **Python Backend:** The backend is responsible for fetching, processing, and storing the mutual fund data. It uses a PostgreSQL database to store the data and provides a set of scripts to automate the data pipeline.
*   **Data Pipeline:** The data pipeline is a set of scripts that download mutual fund data from external sources, process it, and load it into the PostgreSQL database.

## Data Acquisition

The mutual fund data is sourced from the `api.mfapi.in` API. A Windows batch script is provided to automate the download process.

To download the data, follow these steps:

1.  Navigate to the `Data/AMFI` directory.
2.  Rename the `Download_apimfapi.txt` file to `Download_apimfapi.bat`.
3.  Run the `Download_apimfapi.bat` script from the command line.

This script will download over 37,000 JSON files, each containing the historical NAV data for a specific mutual fund. The download process may take a significant amount of time to complete.

## Angular Frontend

The frontend of the application is built with Angular. It provides an interactive user interface for analyzing and comparing mutual funds.

### Prerequisites

Before you can run the Angular application, you need to have the following software installed on your system:

*   [Node.js](https://nodejs.org/) (which includes npm)
*   [Angular CLI](https://cli.angular.io/)

### Setup and Installation

1.  Navigate to the `angular_final/mfanalysis` directory.
2.  Install the project dependencies by running the following command:

    ```bash
    npm install
    ```

### Running the Application

To start the development server, run the following command from the `angular_final/mfanalysis` directory:

```bash
ng serve
```

This will start a local development server. You can access the application by navigating to `http://localhost:4200/` in your web browser.

### Building the Application

To build the application for production, run the following command:

```bash
ng build --output-path docs --base-href /mfanalysis/
```

This will create a `docs` directory with the compiled application files.

### Code Documentation

For a detailed view of the code's structure and comments, we recommend using [Compodoc](https://compodoc.app/), a documentation generator for Angular applications. To generate and view the documentation, you can run the following commands from the `angular_final/mfanalysis` directory:

```bash
npm install -g @compodoc/compodoc
compodoc -p tsconfig.json -s
```

## Python Backend

The Python backend is responsible for processing the downloaded mutual fund data and loading it into a PostgreSQL database.

### Prerequisites

Before you can run the Python scripts, you need to have the following software installed on your system:

*   [Python 3](https://www.python.org/downloads/)
*   [PostgreSQL](https://www.postgresql.org/download/)
*   The `psycopg2` Python library, which can be installed via pip:
    ```bash
    pip install psycopg2
    ```

### Database Setup

1.  Make sure your PostgreSQL server is running.
2.  Create a new database named `projectmf`.
3.  The Python scripts assume a PostgreSQL user named `postgres` with the password `password`. If your configuration is different, you will need to update the database connection settings in the Python scripts.

### Running the Scripts

The Python scripts should be run in the following order to correctly populate the database:

1.  **`pushmfcodes_todb.py`:** This script reads the `apimfapii.json` file, extracts the scheme code and scheme name for each mutual fund, and inserts them into the `mfcodes` table in the database.
2.  **`pushnav_todb.py`:** This script fetches the scheme codes from the `mfcodes` table, creates a new table for each scheme, and populates it with the historical NAV data from the corresponding JSON file. It also updates the `mfcodes` table with additional metadata about each fund.

### Code Documentation

The Python scripts are commented to explain the functionality of the code. For a more detailed view of the code and its structure, you can use a tool like [pdoc](https://pdoc.dev/) to generate HTML documentation from the source code.
