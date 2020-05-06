# Dettifoss - Ratings & Reviews API

## Introduction

The Dettifoss is a powerful waterfall located in Northeast Iceland which also happens to be the name of our stress-tested, horizontally-scaled web server. Custom-developed for an existing e-commerce application intended to host millions of products, reviews, and client forums, our Dettifoss server is comprised of an API for Products, Ratings/Reviews, and Questions/Answers.

## API Overview

The Ratings & Reviews API is concerned with the many reviews attached to a single product. A single review can consist of the numerical rating, photos, and metrics regarding size, width, and comfort. This API is equipped to handle retrieving and posting reviews as well as summarizing review metadata (number of reviews, rating breakdowns, characteristic breakdowns). Routes to handle marking reviews as helpful or inappropriate are also included.

## Outcomes

As is, the server can handle up to 500 clients/second with response times under 20 milliseconds for both reviews and review-metadata.

With load balancing, the system can handle up to 600 clients/second for review-metadata and 1300 clients/second for reviews across 1 million different products with response times under 50 milliseconds.

With NGINX load balancing and a redis cache used to search across a thousand products, the system has shown capabilities up to 3000 clients/second for both reviews and review-metadata with response times under 50 milliseconds.

## Technology Stack

**PostgreSQL** was used to clean, partition, and load over 6 gigabytes of relational CSV data.

**Sequelize** was used to define schemas and facilitate database querying of multiple tables.

**Redis** was used to enable caching of reviews of newer products.

**Docker** was used to containerize and deploy the server on EC2 instances where NGINX load balancing could be leveraged.

## Local Setup

- [ ] - Navigate to the directory and use `npm install` to install dependencies.
- [ ] - Use `example.env` to configure Postgres and Redis credentials.
- [ ] - Use `npm start` to initialize the server.

## Screenshots

**Review Example:**
![Screen Shot 2020-05-05 at 6 54 26 PM](https://user-images.githubusercontent.com/41877388/81136598-0c8a2580-8f2a-11ea-8b14-44f5139dec33.png)

**Review Metadata Example:**
![Screen Shot 2020-05-05 at 6 54 40 PM](https://user-images.githubusercontent.com/41877388/81136530-d51b7900-8f29-11ea-8169-4579a012ba78.png)

## Developers

**Ratings & Reviews API** by John Lee

**Products API** by Zaid Mansuri

**Questions & Answers API** by Patrick Pagba
