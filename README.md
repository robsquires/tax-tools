# monzo-tax-collector
Your friendly tax collector 👮🏻‍♂️





# CLI scripts


### set-earnings

Set gross earnings for the current tax year
```
node scripts/set-earnings.js {gross amount}
```

### gross-up

Get the gross payment required to leave a given amount after tax

```
node scripts/gross-up-payment.js {net amount}
```

### Record payment
Record a gross payment and get amount of tax deducted

```
node scripts/record-payment.js {gross amount}
```