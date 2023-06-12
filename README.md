### AirBean


## Getting Started


### Install dependencies
Install all dependencies using the following command:
```bash
$ npm install
```

### Run tests
```bash
$ npm start
```

## How to use
  ### Postman:
	To get started with our API using Postman, simply import the provided Postman collection file into the app. This will give you 
	access to all the available API endpoints, preconfigured for your convenience!

 ### Database setup:
	Before diving into the API, make sure to populate your database with available products. To do this, navigate to the following route: localhost:3000/api/beans/. 
 
 ### Login and authentication: 
	 When you log in, you'll receive an authorization token. To stay logged in and access protected routes, make sure to add the token to the "Authorization" header of your requests.

 ### User roles: 
	Upon signup, the first user in the database will be granted an "Admin" role, allowing them to create, modify, and remove products. All other users will have a "User" role, which allows them to view their order history.

 ### Promotional offers:
	 When creating or updating a promotional offer, use a string value that represents either a fixed discount (e.g., '10') or a percentage discount (e.g., '10%')
	

### Api routes
1. Go to the menu `localhost:3000/api/beans` to fill database with all the available products. 
GET method 
the response will be.. 
```JSON
{
	"success": true,
	"menu": [
		{
			"id": "coffee-m2h37k2mnh",
			"title": "Latte Macchiato",
			"desc": "Bryggd på månadens bönor.",
			"price": 49,
			"_id": "767AnoOXya4jDi1f"
		}
	]
}
```
Go to `localhost:3000/api/beans/order` to make order . 
POST method 
the request should be .. 
```JSON
{
    "details": {
        "order": [
            {
                "name": "Kaffe Latte",
                "price": 54
            },
            {
                "name": "Bryggkaffe",
                "price": 39
            }
        ]
    }
}
```

the response will be.. 
```JSON
{
	"success": true,
	"order": {
		"orderNr": "909G6F9851",
		"order_date": "2023-06-04"
	}
}
```

------ 

Go to `localhost:3000/api/beans/order/status/{orderNr}` to get order details  . 
GET method 
the response will be.. 
```JSON
{
	"orderNr": "909G6F9851",
	"date": "2023-06-04",
	"order_placed": "18:11:39",
	"Estimated_Delivery": "2023-06-04 , 18:12:39",
	"order_status": " On its way",
	"discount": [
          {
            "product": "Bryggkaffe",
            "value": "30"
          }
        ],
	"final_price": 18,
	"userId": "GUEST",
	"order": [
		{
			"name": "Bryggkaffe",
			"price": 39
		},
		{
			"name": "Bryggkaffe",
			"price": 39
		}
	]
}
```

------ 

Go to `localhost:3000/api/user/signup` to create account  . 
POST method 
the request should be .. 
```JSON
  { "username":"name","password":"000000" }
```
the response will be.. 
```JSON
{
    "userId": "45G9729LA5",
    "username": "name",
    "password": "$2a$10$qiu0LlDa0txb8hvdo3pLs.lpXNzhkG8z6yRumFREuSQgCdHcborh6",
    "role": "admin"
}
```

------ 
Go to `localhost:3000/api/user/login` to log in  . 
POST method 
the request should be .. 
```JSON
  { "username":"name","password":"000000" }
```
the response will be.. 
```JSON
{
    "success": true,
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InNoaXJhayIsImlhdCI6MTY4NjUyNTQxNCwiZXhwIjoxNjg2NTI5MDE0fQ.UoaoqDrvyCRHdRgHZuquOTns1sC1m-5f7LsgwFb_g04",
    "message": "You logged in ! "
}
```
------ 
Go to `localhost:3000/api/user/history` to see order history for logged users   . 
GET method 
the request should contain valid token in headers to view history 

the response will be.. 
```JSON
{
    "success": true,
    "user": "shirak",
    "all_orders": [
        {
            "orderNr": "483307CM4E",
            "totalPrice": 138,
            "discount": [
                {
                    "product": "Mango",
                    "value": "10%"
                }
            ],
            "date": "2023-06-12",
            "estimated_delivery": "2023-06-12,01:21:44",
            "order": [
                {
                    "name": "Bryggkaffe",
                    "price": 39
                },
                {
                    "name": "Mango",
                    "price": 110
                }
            ],
            "order_status": "The order deliverd! "
        }
    ]
}
```
------ 
Go to `localhost:3000/api/admin/addproduct` to add new products . 
POST method 
the request should be .. 
```JSON
  {
    "product": {
        "name": "Mango",
        "description": "Coffe and donky milk",
        "price": 110
    }
}
```
the response will be.. 
```JSON
{
    "success": true,
    "message": "Mango has been add successfuly"
}
```
------ 
Go to `localhost:3000/api/admin/addPromotionalOffer` to add discounts . 
POST method 
the request should be .. 
```JSON
 {
    "offer":{
        "productId":"coffee-0lp6ter3bh",
        "value": "44",
        "expires":"2,hours"  // expiration time it takes (hours and days ), it must contain ','
    }
}
```
the response will be.. 
```JSON
{
    "id": "G45BN974A3",
    "product": "Kaffe Latte",
    "productId": "coffee-0lp6ter3bh",
    "value": "44",
    "createdAt": "2023-06-12,01:25:13",
    "expires": "2,hours",
    "expire_date": "2023-06-12",
    "expire_time": "03:25:13",
    "timestamp": 1686525913201,
    "expire_timestamp": 1686533113201
}
```
------ 
Go to `localhost:3000/api/admin/editproduct/{productId}` to edit existing product . 
POST method 
the request should be .. 
```JSON
 {
    "product": {
        "name": "Monaco",
        "description": "Made in Sweden",
        "price": 39
    }
}
```
the response will be.. 
```JSON
{
    "success": true,
    "message": "Monaco has been edited successfuly",
    "product": {
        "id": "coffee-vxig26my4y",
        "title": "Monaco",
        "desc": "Made in Sweden",
        "price": 39,
        "createdAt": "No data", // 'No data ' if the product is original in database, 
        "modifiedAt": "2023-06-12,01:23:49",
        "timestamp": 1686525829300
    }
}
```
------ 
Go to `localhost:3000/api/admin/removeproduct/{productId}` to edit existing product . 
GET method 
the request should contain valid token
the response will be.. 
```JSON
{
    "success": true,
    "message": "Monaco has been edited successfuly",
    "product": {
        "id": "coffee-vxig26my4y",
        "title": "Monaco",
        "desc": "Made in Sweden",
        "price": 39,
        "createdAt": "No data", // 'No data ' if the product is original in database, 
        "modifiedAt": "2023-06-12,01:23:49",
        "timestamp": 1686525829300
    }
}
```
------ 
#### mabye you want to see more projects 
Codepen , visit [here](https://codepen.io/shirakserop).

  
