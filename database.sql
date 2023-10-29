CREATE DATABASE IF NOT EXISTS budgetbook;

CREATE TABLE IF NOT EXISTS account (
   user_id SERIAL PRIMARY KEY,
   user_email VARCHAR(255) UNIQUE NOT NULL,
   user_name VARCHAR(255),
   user_password VARCHAR(255) NOT NULL,
   user_balance NUMERIC(10, 2) NOT NULL
);

CREATE TABLE IF NOT EXISTS category (
   category_id VARCHAR(100) PRIMARY KEY,
   category_name VARCHAR(100),
   category_created_at VARCHAR(255),
   category_limit NUMERIC(7,2),
   category_color VARCHAR(50),
   user_id INT,
   FOREIGN KEY (user_id) REFERENCES account (user_id) ON DELETE CASCADE
);

 CREATE TABLE IF NOT EXISTS expense (
   expense_id VARCHAR(100) PRIMARY KEY,
   expense_name VARCHAR(100) NOT NULL,
   expense_created_at VARCHAR(255),
   expense_amount NUMERIC(7,2) NOT NULL,
   category_id VARCHAR(100),
   user_id INT,
   FOREIGN KEY (category_id) REFERENCES category (category_id),
   FOREIGN KEY (user_id) REFERENCES account (user_id)
 );

CREATE TABLE IF NOT EXISTS balance (
  balance_id SERIAL PRIMARY KEY,
  user_id INT,
  amount NUMERIC(10, 2),
  FOREIGN KEY (user_id) REFERENCES account (user_id)
);

CREATE TABLE IF NOT EXISTS contributors (
  contribution_id SERIAL PRIMARY KEY,
  split_amount NUMERIC(7,2),
  user_id INT,
  FOREIGN KEY (user_id) REFERENCES account (user_id)
);

CREATE TABLE IF NOT EXISTS "group"(
  group_id VARCHAR(100),
  group_name VARCHAR(255),
  user_id INT,
  pool_amount INT,
  status INT,
  balance_amount NUMERIC(10, 2),
  FOREIGN KEY (user_id) REFERENCES account(user_id),
  PRIMARY KEY(group_id,user_id)
);

CREATE TABLE IF NOT EXISTS user_payments (
  payment_id SERIAL PRIMARY KEY,
  user_id INT,
  group_id VARCHAR(100),
  amount NUMERIC(10, 2),
  FOREIGN KEY (user_id) REFERENCES account(user_id),
  FOREIGN KEY (group_id, user_id) REFERENCES "group"(group_id, user_id)
);

CREATE TABLE IF NOT EXISTS sms(
TEXT user_email PRIMARY KEY,
INT sms_amount,
DATE sms_date,
TEXT sms_type
);
