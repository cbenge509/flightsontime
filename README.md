Flight Delay & Ontime Prediction
==========================================================

![GitHub](https://img.shields.io/github/license/cbenge509/flightsontime) ![GitHub Pipenv locked Python version](https://img.shields.io/github/pipenv/locked/python-version/cbenge509/flightsontime) ![GitHub Pipenv locked dependency version](https://img.shields.io/github/pipenv/locked/dependency-version/cbenge509/flightsontime/xgboost) ![GitHub Pipenv locked dependency version](https://img.shields.io/github/pipenv/locked/dependency-version/cbenge509/flightsontime/plotly) ![GitHub Pipenv locked dependency version](https://img.shields.io/github/pipenv/locked/dependency-version/cbenge509/flightsontime/seaborn) ![GitHub Pipenv locked dependency version](https://img.shields.io/github/pipenv/locked/dependency-version/cbenge509/flightsontime/tensorflow)

<img align="right" width="180" src="./images/ucb.png"/> 

#### Authors : [Ning (Louis) Li](https://www.linkedin.com/in/louisli/) | [Andrew Fogarty](https://www.linkedin.com/in/afogarty85/) | [Siduo (Stone) Jiang](https://www.linkedin.com/in/siduojiang/) | [Cristopher Benge](https://cbenge509.github.io/)

[![](https://sourcerer.io/fame/cbenge509/cbenge509/flightsontime/images/0)](https://sourcerer.io/fame/cbenge509/cbenge509/flightsontime/links/0)[![](https://sourcerer.io/fame/cbenge509/cbenge509/flightsontime/images/1)](https://sourcerer.io/fame/cbenge509/cbenge509/flightsontime/links/1)[![](https://sourcerer.io/fame/cbenge509/cbenge509/flightsontime/images/2)](https://sourcerer.io/fame/cbenge509/cbenge509/flightsontime/links/2)[![](https://sourcerer.io/fame/cbenge509/cbenge509/flightsontime/images/3)](https://sourcerer.io/fame/cbenge509/cbenge509/flightsontime/links/3)[![](https://sourcerer.io/fame/cbenge509/cbenge509/flightsontime/images/4)](https://sourcerer.io/fame/cbenge509/cbenge509/flightsontime/links/4)[![](https://sourcerer.io/fame/cbenge509/cbenge509/flightsontime/images/5)](https://sourcerer.io/fame/cbenge509/cbenge509/flightsontime/links/5)[![](https://sourcerer.io/fame/cbenge509/cbenge509/flightsontime/images/6)](https://sourcerer.io/fame/cbenge509/cbenge509/flightsontime/links/6)[![](https://sourcerer.io/fame/cbenge509/cbenge509/flightsontime/images/7)](https://sourcerer.io/fame/cbenge509/cbenge509/flightsontime/links/7)


U.C. Berkeley, Masters in Information & Data Science program - [datascience@berkeley](https://datascience.berkeley.edu/) <br>
Fall 2020, W261 - Machine Learning at Scale - [James York-Winegar](https://www.ischool.berkeley.edu/people/james-york-winegar) || [Jacob Baumbach](https://www.ischool.berkeley.edu/people/jacob-baumbach)

---

## Description

Flight delays create problems in scheduling for airlines and airports, leading to passenger inconvenience, and huge economic losses. As a result there is growing interest in predicting flight delays beforehand in order to optimize operations and improve customer satisfaction. In this project, we predict flight delays using the W261 datasets provided. All tasks for this problem to be tackled in Microsoft Azure Databricks.

This repository contains the code, models, and documentation to predict flight delays as part of the final project for W261 in the Fall 2020 semester.

#### Highlight of key files included in this repository:

  |File | Description |
  |:----|:------------|
  | [Final Presentation](/presentation/Delayed%20Flights%20Prediction%20-%20Final.pptx) | Our final presentation and overview of solution. |
  | [Preprocessing & Feature Engineering](/notebooks/1.%20Preprocessing%20and%20Feature%20Engineering.ipynb) | Data pre-processing and feature engineering. |
  | [EDA: Flights Data](/notebooks/2.1%20EDA%20-%20Flights.ipynb) | Exploratory data analysis for `FLIGHTS` dataset. |
  | [EDA: Weather & Stations Data](/notebooks/2.2%20EDA%20-%20Weather.ipynb) | Exploratory data analysis for `WEATHER` and `STATIONS` dataset. |
  | [Toy Model](/notebooks/3.%20Toy_LR.ipynb) | Toy Logistic Regression model. |
  | [Model Training](/notebooks/4.%20Model%20Development%20with%20PySpark%20ML.ipynb) | Machine learning model training and cross-validation. |
  | [Neural Network Pipeline](/notebooks/5.%20FF_NN%20Pipeline.ipynb) | Feed-forward neural network model pipeline notebook. |
  
---

Data Processing Pipeline
-------------

<img src="./images/data_engineering.png" align="center"/>


---

Solution Architecture
-----------

<img src="./images/solution_architecture.png" align="center">

---

Data Visualization
-------------

<img src="./images/EDA_flight_volume_map.png" align="center"/><br>

<img src="./images/EDA_delays_by_airline.png" align="center"/><br>

<img src="./images/EDA_delay_prev_flight.png" align="center"/><br>

<img src="./images/EDA_annual_delayed_flights.png" align="center"/><br>

<img src="./images/EDA_delay_average_by_airline.png" align="center"/><br>

<img src="./images/EDA_correlation.png" align="center"/><br>

<img src="./images/EDA_ontime_flights.png" align="center"/><br>

<img src="./images/EDA_origin_delays.png" align="center"/><br>

---

Toy Example (LR)
---------------

<img src="./images/LR_toy_example.png" align="left"/><br>

---

License
-------
Licensed under the MIT License. See [LICENSE](LICENSE.txt) file for more details.
