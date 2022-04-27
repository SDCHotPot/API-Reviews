CREATE DATABASE reviewssdc;

\c reviewssdc;

CREATE TABLE products (
  id              SERIAL PRIMARY KEY UNIQUE,
  name            VARCHAR,
  slogan          VARCHAR,
  description     VARCHAR,
  category        VARCHAR,
  default_price   INT
);
\COPY products FROM 'dbms/csv/product.csv' delimiter ',' csv header;
ALTER TABLE products
  DROP COLUMN IF EXISTS slogan,
  DROP COLUMN IF EXISTS description,
  DROP COLUMN IF EXISTS category,
  DROP COLUMN IF EXISTS default_price;

CREATE TABLE IF NOT EXISTS reviews (
  id              SERIAL PRIMARY KEY UNIQUE,
  product_id      INTEGER ,
  rating          SMALLINT ,
  date            BIGINT ,
  summary         VARCHAR ,
  body            VARCHAR(500) ,
  recommended     BOOLEAN ,
  reported        BOOLEAN DEFAULT 'false' ,
  reviewer_name   VARCHAR ,
  reviewer_email  VARCHAR ,
  response        VARCHAR DEFAULT null,
  helpfulness     INTEGER DEFAULT 0
);
ALTER TABLE reviews ADD FOREIGN KEY (product_id) REFERENCES products (id);
\COPY reviews FROM 'dbms/csv/reviews.csv' delimiter ',' csv header;
CREATE INDEX review_product_id ON reviews USING HASH (product_id);
SELECT setval('reviews_id_seq', (SELECT MAX(id) FROM reviews)+1);

UPDATE reviews SET date=date/1000;
ALTER TABLE reviews ALTER COLUMN date TYPE TIMESTAMP WITHOUT TIME ZONE USING to_timestamp(date) AT TIME ZONE 'UTC';
ALTER TABLE reviews ALTER COLUMN date set DEFAULT CURRENT_TIMESTAMP;

CREATE TABLE IF NOT EXISTS characteristics (
  id              SERIAL PRIMARY KEY UNIQUE,
  product_id      INTEGER,
  name            VARCHAR
);
ALTER TABLE characteristics ADD FOREIGN KEY (product_id) REFERENCES products (id);
\COPY characteristics FROM 'dbms/csv/characteristics.csv' delimiter ',' csv header;
CREATE INDEX characteristics_product_id ON characteristics USING HASH (product_id);
SELECT setval('characteristics_id_seq', (SELECT MAX(id) FROM characteristics)+1);


CREATE TABLE IF NOT EXISTS photos (
  id              SERIAL PRIMARY KEY UNIQUE,
  review_id       INTEGER,
  url             VARCHAR(500)
);
ALTER TABLE photos ADD FOREIGN KEY (review_id) REFERENCES reviews (id);
\COPY photos FROM 'dbms/csv/reviews_photos.csv' delimiter ',' csv header;
CREATE INDEX photos_review_id ON photos USING HASH (review_id);
SELECT setval('photos_id_seq', (SELECT MAX(id) FROM photos)+1);


CREATE TABLE IF NOT EXISTS characteristic_reviews (
  id                SERIAL PRIMARY KEY UNIQUE,
  characteristic_id BIGINT,
  review_id         INTEGER,
  value             SMALLINT
);
ALTER TABLE characteristic_reviews ADD FOREIGN KEY (characteristic_id) REFERENCES characteristics (id);
ALTER TABLE characteristic_reviews ADD FOREIGN KEY (review_id) REFERENCES reviews (id);
\COPY characteristic_reviews FROM 'dbms/csv/characteristic_reviews.csv' delimiter ',' csv header;
CREATE INDEX characteristic_reviews_characteristic_id ON characteristic_reviews USING HASH (characteristic_id);
CREATE INDEX characteristic_reviews_review_id ON characteristic_reviews USING HASH (review_id);
SELECT setval('characteristic_reviews_id_seq', (SELECT MAX(id) FROM characteristic_reviews)+1);
