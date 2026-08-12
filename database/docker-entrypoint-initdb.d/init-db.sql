-- create table for product

CREATE TABLE product
(
  productid serial UNIQUE PRIMARY KEY,
  description character varying(10485760) NOT NULL,
  image character varying(255) NOT NULL,
  name character varying(255) NOT NULL,
  price double precision NOT NULL
);

ALTER TABLE product
  OWNER TO gordonuser;

ALTER ROLE gordonuser CONNECTION LIMIT -1;

-- add product data
-- note: images are pulled from the public folder at onlineshop/app/react-app/public
-- Keep these IDs and product details aligned with react-app/src/api/products.json.
-- Wishlist rows reference these records, so the profile must receive the same
-- product the customer selected in the storefront.
INSERT INTO product (name, description, image, price) VALUES ('Everyday Canvas Tote', 'Durable cotton canvas tote with interior pockets for market runs, laptops, and daily essentials.', 'https://images.unsplash.com/photo-1594223274512-ad4803739b7c?auto=format&fit=crop&w=900&q=85', 34.0);
INSERT INTO product (name, description, image, price) VALUES ('CloudKnit Lounge Hoodie', 'Ultra-soft midweight hoodie with a relaxed fit and brushed fleece interior.', 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=900&q=85', 68.0);
INSERT INTO product (name, description, image, price) VALUES ('MagSafe Travel Charger', 'Fold-flat wireless charger built for phones, earbuds, and hotel-nightstand convenience.', 'https://images.unsplash.com/photo-1587033411391-5d9e51cce126?auto=format&fit=crop&w=900&q=85', 49.0);
INSERT INTO product (name, description, image, price) VALUES ('Ceramic Pour-Over Set', 'Minimal ceramic dripper and matching mug set for slow mornings and cafe-quality coffee.', 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=900&q=85', 42.0);
INSERT INTO product (name, description, image, price) VALUES ('Recovery Yoga Mat', 'Cushioned non-slip mat with alignment guides for yoga, stretching, and mobility work.', 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?auto=format&fit=crop&w=900&q=85', 72.0);
INSERT INTO product (name, description, image, price) VALUES ('Hydrating Skin Duo', 'Daily cleanser and moisturizer pair with lightweight hydration for all skin types.', 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=900&q=85', 38.0);
INSERT INTO product (name, description, image, price) VALUES ('Commuter Tech Organizer', 'Slim zip pouch with elastic loops and mesh pockets for cables, drives, and adapters.', 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&q=85', 29.0);
INSERT INTO product (name, description, image, price) VALUES ('Linen Blend Throw Blanket', 'Breathable woven throw that adds texture to sofas, beds, and cozy reading corners.', 'https://images.unsplash.com/photo-1580301762395-21ce84d00bc6?auto=format&fit=crop&w=900&q=85', 58.0);
INSERT INTO product (name, description, image, price) VALUES ('Trail Runner Bottle', 'Leakproof insulated bottle with one-hand cap for workouts, hikes, and everyday hydration.', 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=900&q=85', 26.0);

