# Tax tools 👮‍♂️ 👮

A collection of tools to help manage taxes

- **Queries/commands** that keep track of how much tax is owed during a tax year. Can be invoked on the command line or over HTTP

- **What's my dividend?** An Apple Shortcut that tells you the value of a dividend payment required to leave a given amount after tax

- **Monzo Tax collector** - A Monzo webhook which automatically collects tax in a pot when a payment is made - WIP


# Queries/commands


## Gross Up

Calculates the gross payment required to leave a given net amount after tax

### Parameters

`amount: Number, up to 2 dp. should represent the amount in Pounds`


### HTTP Endpoint
```
GET /gross-up?amount={amount}


Example
-------
Request: GET /gross-up?amount=500.10
Response: 540.66
```

### CLI Script

```
node scripts/gross-up-payment.js {amount}
```

## Set Earnings

Set gross earnings for the current tax year

### Parameters

`amount: Number, up to 2 dp. should represent the amount in Pounds`


### CLI scripts
```
node scripts/set-earnings.js {amount}
```
## Process payment
Deduct tax on a payment made into your Monzo account:
- Calculates tax and moves it to a pot
- Adds the payment to your earnings

A transaction will progress through several steps until it is fully processed. The steps are documented here: `/src/lib/monzo/transaction-log.js#L39` It can only be fully processed once.

It's possible to see a log of all processed transactions using the **get processed payments** command

### Parameters

`transactionId: Monzo transaction ID for the payment`

### CLI scripts
```
node scripts/process-payment.js {transactionId}
```

## Get processed payments
See a log of all processed transactions for the current tax year

```
node scripts/get-processed-payments.js
```

## Record payment
Adds an amount to your earnings for the current tax year. Returns the tax due

### Parameters

`amount: Number, up to 2 dp. should represent the amount in Pounds`

### CLI scripts

```
node scripts/record-payment.js {amount}
```


## What's my dividend?

 https://www.icloud.com/shortcuts/a6ac76410cb947fd8a613b3d11060742

<img width="1275" alt="Screenshot 2021-02-05 at 12 52 41" src="https://user-images.githubusercontent.com/616321/107036130-0a9f0c80-67b1-11eb-9b33-f90f83e52d71.png">



## Monzo Tax collector


Use the script `monzo-login` to log in to Monzo and save the access token to S3

<img width="1435" alt="Screenshot 2021-02-07 at 12 02 41" src="https://user-images.githubusercontent.com/616321/107145938-e7a16380-693c-11eb-817f-f621014d6f11.png">

