# API-Reviews

## Authors
Pascal Bui -

|Contact Me| |
|-------------|--------|
|<img src="https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white" href="https://www.linkedin.com/in/pascal-bui-b44ab955" /> - |https://www.linkedin.com/in/pascal-bui-b44ab955|
|<img src="https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white"/> - | https://github.com/RphPandan|



## Stack
<img src="https://img.shields.io/badge/Express%20js-000000?style=for-the-badge&logo=express&logoColor=white"/> <img src="https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white"/> <img src="https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white" /> <img src="https://img.shields.io/badge/Amazon_AWS-FF9900?style=for-the-badge&logo=amazonaws&logoColor=white"/>

## Overview

This Systems Design Capstone project was developed during the senior phase of the Hack Reactor Software Engineering Immersive (RFP2202). Our group was tasked to implement a REST API service for an e-commerce application. This particular API service was developed for the '/reviews' endpoints specifically.


## Install

```
npm install
```
change example.env to .env and configure variables.

## Postgres set up

Schema file can be found in dbms/postgres/seed.sql and run with the following command

```
npm run seed
```
Note that csv files are not provided, seed.sql will still create the database/tables/foreign keys etc... as well as index each table additionally by the foreign key.

## Run the App

```
npm run server
```

## Run the Tests

```
npm test
```

## Description/API EndPoint

The API endpoints for this service are as follows:

| Method | Path    |
|--------|---------|
| GET    | '/reviews'       |
| GET    | '/reviews/meta'  |
| POST   | '/reviews'       |
| PUT    | '/reviews/:review_id'/ (helpful OR reported)  |

### GET /reviews/
Will return a list of reviews for specified product.
#### Parameters
| Parameter | Type    | Description                                                |
|-----------|---------|------------------------------------------------------------|
| product_id| Integer | Required - Specifies which product to return reviews for   |
| [count]   | Integer | Specifies how many results per page to return. Default 5.  |
| [page]    | Integer | Specifies which page of results to return.     Default 1.  |
| [sort]    | String  | Will return reviews sorted by 'newest'/'helpful'/'relevant'|

#### Response
status - 200
```json
{
    "product": 1,
    "page": 1,
    "count": 5,
    "sort": "newest",
    "results": [
        {
            "review_id": 2,
            "rating": 4,
            "summary": "This product was ok!",
            "recommend": false,
            "response": "null",
            "body": "I really did not like this product solely because I am tiny and do not fit into it.",
            "date": "2021-01-09T15:47:13.000Z",
            "reviewer_name": "mymainstreammother",
            "helpfulness": 2,
            "reported": false,
            "photos": []
        },
        {
            "review_id": 1,
            "rating": 5,
            "summary": "This product was great!",
            "recommend": true,
            "response": "null",
            "body": "I really did or did not like this product based on whether it was sustainably sourced.  Then I found out that its made from nothing at all.",
            "date": "2020-07-30T10:41:21.000Z",
            "reviewer_name": "funtime",
            "helpfulness": 8,
            "reported": false,
            "photos": []
        }
    ]
}
```

### GET /reviews/meta
Will return aggregate meta data for a specified product.

#### Parameters
| Parameter | Type    | Description                                                  |
|-----------|---------|--------------------------------------------------------------|
| product_id| Integer | Required - Specifies which product to return meta data for   |

#### Response
status - 200
```json
{
    "product_id": 1,
    "ratings": {
        "1": 0,
        "2": 0,
        "3": 0,
        "4": 1,
        "5": 1
    },
    "recommended": {
        "true": 1,
        "false": 1
    },
    "characteristics": {
        "Fit": {
            "id": 1,
            "value": 4
        },
        "Length": {
            "id": 2,
            "value": 3.5
        },
        "Comfort": {
            "id": 3,
            "value": 5
        },
        "Quality": {
            "id": 4,
            "value": 4
        }
    }
}
```

### POST /reviews/meta
Will post a review for specified product into the database.

#### Body Parameters

| Parameter       | Type    | Description                                                |
|-----------------|---------|------------------------------------------------------------|
| product_id      | Integer | Required ID of the product to post the review for.         |
| rating          | Integer | Integer (1-5) indicating the review rating.                |
| summary         | String  | Summary text of the review.                                |
| body            | String  | Continued or full text of the review.                      |
| recommend       | Boolean | Value indicating if the reviewer recommends the product.   |
| name            | String  | Username for question asker.                               |
| email           | String  | Email address for question asker.                          |
| photos          | Array   | Array of text urls that link to images to be shown.        |
| characteristcs  | Object  | Object of keys representing characteristic_id and values representing the review value for that characteristic. { "14": 5, "15": 5 //...}|

#### Example Body
```json
{
    "product_id": 4123,
    "rating": 4,
    "summary": "product was alright",
    "body": "there were some scratchy bits but quality was ok",
    "recommend": true,
    "name": "Bob Bloblaw",
    "email": "BobLaw@gmail.com",
    "photos": ["https://images.unsplash.com/photo-1533779183510-8f55a55f15c1?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=668&q=80"],
    "characteristics": {"13801": 2,
                        "13798": 3,
                        "13799": 4,
                        "13800": 5
                                    }
}
```

#### Response
Status: 201 - review for product ${product_id} CREATED


### PUT /reviews/:review_id/ (either helpful OR report)
Updates a review to show it was found to be helpful or to be reported. Note, reporting a review does not delete it but the review will not be returned in the above GET request.

#### Route Parameters

| Parameter   | Type    | Description                           |
|-------------|---------|---------------------------------------|
| review_id   | Integer | Required ID of the review to update   |

#### Response
Status: 204 - No Content.
