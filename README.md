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
1. Go to `localhost:3000/api/beans` to fill database with all the available products. 
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
        "order":[
            {
			"name": "Kaffe Latte",
			"price": 54
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
	"userId": "631QQJ64F3",
	"username": "name",
	"password": "$2b$10$JcSpPD91P.acdMWgFCKYQeAKKaDsMHgUiYib9dWZPiUvaKXAbikGC",
	"islogged": false,
	"userHistory": []
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
	"message": "You are logged in!"
}
```

------ 
Go to `localhost:3000/api/user/logout` to log out   . 
POST method 
the request should be .. 
```JSON
  {
	"username": "name"
   }
```
the response will be.. 
```JSON
{
	"success": true,
	"message": "You are logged out!"
}
```

------ 
Go to `localhost:3000/api/user/history` to see order history for logged users   . 
POST method 
the request should be .. 
```JSON
  {
	"userId":"631QQJ64F3"
   }
```
the response will be.. 
```JSON
{
	"success": true,
	"user": "shirak",
	"all_orders": [
		{
			"orderNr": "4RJKDJ3394",
			"coupon": {},
			"totalPrice": 78,
			"discountPrice": null,
			"date": "2023-06-04",
			"estimated_delivery": "2023-06-04,18:08:23",
			"order": [
				{
					"name": "Bryggkaffe",
					"price": 39
				},
				{
					"name": "Bryggkaffe",
					"price": 39
				}
			],
			"order_status": "The order deliverd! "
		}
	]
}
```

------ 
Go to `localhost:3000/api/beans/coupon` to generate discount coupon. 
GET method 

the response will be.. 
```JSON
{
	"Coupon": "0P1699DL",
	"value": 30,
	"timestamp": 1685894001700,
	"expireDays": 1,
	"expires": "2023-06-05"
}
```

------ 


#### mabye you want to see more projects 
Codepen , visit [here](https://codepen.io/shirakserop).

  
