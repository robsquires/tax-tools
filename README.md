# monzo-tax-collector
Your friendly tax collector 👮🏻‍♂️


A collection of tools to help manage taxes

- **Queries/commands** that keep track of how much tax is owed during a tax year. Can be invoked on the command line or over HTTP

- **What's my dividend?** An Apple Shortcut that tells you the value of a dividend payment required to leave a given amount after tax

- **Monzo Tax collector** - A Monzo webhook which automatically collects tax in a pot when a payment is made. WIP


# Queries/commands


## Gross Up

Calculates the gross payment required to leave a given net amount after tax

### Parameters

`amount: Number, excluding currency symbol` 


### HTTP Endpoint
```
GET /gross-up?amount={amount}


Example
-------
Request: GET /gross-up?amount=500
Response: 540.54
```

### CLI Script

```
node scripts/gross-up-payment.js {amount}
```

## Set Earnings

Set gross earnings for the current tax year

### Parameters

`amount: Number`


### CLI scripts
```
node scripts/set-earnings.js {amount}
```

## Record payment
Record a gross payment. Returns the tax due

### Parameters

`amount: Number`

### CLI scripts

```
node scripts/record-payment.js {amount}
```


## What's my dividend?

 https://www.icloud.com/shortcuts/a6ac76410cb947fd8a613b3d11060742

<img width="1275" alt="Screenshot 2021-02-05 at 12 52 41" src="https://user-images.githubusercontent.com/616321/107036130-0a9f0c80-67b1-11eb-9b33-f90f83e52d71.png">


