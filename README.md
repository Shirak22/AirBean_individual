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
            "userId":"631QQJ64F3",
            "coupon":"0P1699DL",
        "order":[
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
	"total_price": 78,
	"coupon": "30%",
	"discount": "23.4:-",
	"final_price": 54.6,
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

  