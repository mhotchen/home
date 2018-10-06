USE digithera_test;

INSERT INTO users (username, email)
VALUES
  ('matt', 'm@mhn.me'),
  ('lucas', 'lucas@digithera.ai');

INSERT INTO products (name, price)
VALUES
  ('A toy', 1000),
  ('A shoe', 15000),
  ('A thing', 12500);

INSERT INTO transactions (user_id, amount)
VALUES
  (1, -1000),
  (1, -15000),
  (1, 100000),
  (2, -1000),
  (2, -15000),
  (2, 500000);

INSERT INTO purchases (user_id, product_id, transaction_id, discount_id, discount_percentage)
VALUES
  (1, 1, 1, NULL, NULL),
  (1, 2, 2, NULL, NULL),
  (1, 1, 4, NULL, NULL),
  (1, 2, 5, NULL, NULL);

INSERT INTO discounts (user_id, product_id, percentage)
VALUES
  (2, 3, 4000);
