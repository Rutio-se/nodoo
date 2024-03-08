# async-node-odoo (nodoo)
Simple node odoo api, async functions and a template for simpler use from node. Only for inspiration, no warranties at all.

# Example use

## Installation
Add this module to your package.json such as 
```
{
  "dependencies": {
    "async-node-odoo": ">=0.0.3",
  }
}
```

Run yarn install

## Code example (in your .js file)

```
const nodoo = require('async-node-odoo');

const myOdoo = {
    url: "https://my.odoo.com",
    //     port: <insert server Port (by default 80)>,
    db: 'myodoodb',
    username: 'myemail@mydomain.net',
    password: '467e68242349...', // API Key to your account,
}

const test = async (name) => {
    try {
        await nodoo.connect(myOdoo);
        const order = await nodoo.search_read_unique("purchase.order", {name}, ["id", "product_id", "origin"]);
        console.log(order);
    } catch (e) {
        console.log(e);
    }
}

// Example: Call this with a order number as argument
test(process.argv[2]);

```


