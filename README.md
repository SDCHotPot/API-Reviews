# API-Reviews

## Authors
Pascal Bui - https://github.com/RphPandan
| <img src="https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white" href='https://wwwlinkedin.com/in/pascal-bui-b44ab955'/>



## Stack
| <img src="https://img.shields.io/badge/Express%20js-000000?style=for-the-badge&logo=express&logoColor=white"/> | <img src="https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white" /> | <img src="https://img.shields.io/badge/Amazon_AWS-FF9900?style=for-the-badge&logo=amazonaws&logoColor=white"/>

## Overview

This Systems-Design Capstone project was developed during the senior phase of the Hack Reactor Software Engineering Immersive (RFP2202). Our group was tasked to implement a REST API service for an e-commerce application. This particular API service was developed for the '/reviews' endpoints specifically.


## Install

  ```
  npm install
  ```

## Run the App

```
npm start
```

## Run the Tests

```
npm test
```

## Description/API EndPoint

The API endpoints for this service are as follows:
  * GET request - '/reviews'
  * GET request - '/reviews/meta'
  * POST request - '/reviews'
  * PUT request - '/reviews/:review_id'/helpful || reported

### 'GET /reviews/'
Will return a list of reviews for specified product.
#### Parameters
| Parameter | Type    | Description                                                |
|-----------|---------|------------------------------------------------------------|
| product_id| Integer | Required - Specifies which product to return reviews for   |
| [count]   | Integer | Specifies how many results per page to return. Default 5.  |
| [page]    | Integer | Specifies which page of results to return.     Default 1.  |
| [sort]    | String  | Will return reviews sorted by 'newest'/'helpful'/'relevant'|

#### Response
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

### 'GET /reviews/meta'
Will return aggregate meta data for a specified product.

#### Parameters
| Parameter | Type    | Description                                                  |
|-----------|---------|--------------------------------------------------------------|
| product_id| Integer | Required - Specifies which product to return meta data for   |

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

