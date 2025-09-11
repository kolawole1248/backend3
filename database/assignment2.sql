-- 1. Insert Tony Stark record
INSERT INTO public.account (account_firstname, account_lastname, account_email, account_password)
VALUES ('Tony', 'Stark', 'tony@starkent.com', 'Iam1ronM@n');

-- 2. Modify Tony Stark record to change account_type to "Admin"
UPDATE public.account 
SET account_type = 'Admin'
WHERE account_firstname = 'Tony' AND account_lastname = 'Stark';

-- 3. Delete Tony Stark record from the database
DELETE FROM public.account 
WHERE account_firstname = 'Tony' AND account_lastname = 'Stark';

-- 4. Modify GM Hummer description
UPDATE public.inventory 
SET inv_description = REPLACE(inv_description, 'small interiors', 'a huge interior')
WHERE inv_make = 'GM' AND inv_model = 'Hummer';

-- 5. Inner join for Sport category vehicles
SELECT inv.inv_make, inv.inv_model, classification.classification_name
FROM public.inventory AS inv
INNER JOIN public.classification ON inv.classification_id = classification.classification_id
WHERE classification.classification_name = 'Sport';

-- 6. Update image paths to include "/vehicles"
UPDATE public.inventory 
SET 
    inv_image = REPLACE(inv_image, '/images/', '/images/vehicles/'),
    inv_thumbnail = REPLACE(inv_thumbnail, '/images/', '/images/vehicles/');