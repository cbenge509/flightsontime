# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Flight delay prediction project using machine learning at scale. Developed for UC Berkeley W261 (Machine Learning at Scale) Fall 2020. The solution predicts flight delays using the W261 datasets and was designed to run in Microsoft Azure Databricks.

## Environment Setup

**Python Version:** 3.7.6

```bash
# Using Pipenv (recommended)
pipenv install

# Or using pip
pip install -r requirements.txt
```

**Key Dependencies:** koalas 1.3.0, pandas 1.0.1, tensorflow 2.3.1, xgboost 1.2.1, plotly 4.10.0, seaborn 0.10.0

## Architecture

This is a Jupyter notebook-based data science project with no formal build/test/lint system. The notebooks are designed to run in Azure Databricks.

### Pipeline Stages

1. **Preprocessing & Feature Engineering** (`notebooks/1. Preprocessing and Feature Engineering.ipynb`)
   - Data cleaning and integration from flights, weather, and stations datasets

2. **Exploratory Data Analysis**
   - `notebooks/2.1 EDA - Flights.ipynb` - Flight dataset analysis
   - `notebooks/2.2 EDA - Weather.ipynb` - Weather and stations analysis

3. **Baseline Model** (`notebooks/3. Toy_LR.ipynb`)
   - Proof-of-concept logistic regression
   - Manual implementation in `scripts/toy_LR.py` using PyTorch-style forward/backward propagation

4. **Production Models**
   - `notebooks/4. Model Development with PySpark ML.ipynb` - PySpark ML with cross-validation
   - `notebooks/5. FF_NN Pipeline.ipynb` - TensorFlow feed-forward neural network

### Data Flow

Raw data (Flights, Weather, Stations) → Preprocessing → Feature Engineering → Model Training → Predictions

## Working with This Codebase

- Notebooks are the primary deliverables and contain embedded outputs/visualizations
- The `scripts/toy_LR.py` contains a standalone manual logistic regression implementation
- Images in `images/` are referenced by README.md for documentation
- Presentation materials are in `presentation/` (requires custom fonts - see `presentation/Read Me First.txt`)
