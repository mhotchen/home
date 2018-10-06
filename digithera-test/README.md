# Quit Genius Technical Test

## Design liberties

### Product price could change

The first thing to note is that the product price may be subject to change which would cause the transactions in their
current format to become inaccurate since they don't keep a record of the original price. There are two ways to solve
this:

1. Keep a record of the price alongside the transaction
2. Make the product immutable

The latter would mean having some sort of separate table to keep a history of the product's price, which may also make
itself useful when it comes to business insight and intelligence but given time constraints I'm opting for the former
option.

### User email too short

Some emails can be much longer.

### User ID shouldn't be a custom format

Again there are two approaches and again due to time constraints I'm opting for the easier of the two:

1. Use an incrementing ID
2. Use a unique identifier such as a UUID

I personally prefer UUIDs, which Postgres can generate in the DB with guarantees of uniqueness. The primary reason is
that it reduces the predictability of your systems and with some care it also allows clients to generate their own
IDs so they can store data offline in case of unreliable internet.

Unfortunately I don't have time to dive in to UUIDs in MySQL so I'm opting for the easier route: an incrementing ID.

### Don't store price with floating point precision

The price/salary fields should not use floating point precision which can cause inaccurate results (eg. 0.1 + 0.2
!== 0.3). Instead the amount should be in the currency's subunit. A currency field may also be useful but for now
since I have no understanding of the system I will assume that the whole thing currently uses a single currency.

### Merge transactions and salaries

Ultimately this is a simple ledger statement with money in and money out. Rather than use two different tables, a
single one should be used which allows for easier calculations of things like the current balance. A purchases
table will exist which links to a row in the ledger.

The purchase table should also store the applied discount in case of changes to discounts.

## Final table structure

The final table structure can be found in `db.sql`. You can load it in to the sample database by starting docker and
running:

```bash
docker-compose up
cat db.sql | docker exec -i digithera-mysql mysql -psupersecure
cat sample_data.sql | docker exec -i digithera-mysql mysql -psupersecure
```
