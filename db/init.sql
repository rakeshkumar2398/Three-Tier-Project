-- =========================
-- Categories
-- =========================
INSERT INTO categories (created_at, description, name)
VALUES
(NOW(), 'Tea items', 'Tea'),
(NOW(), 'Snack items', 'Snacks')
ON CONFLICT DO NOTHING;

-- =========================
-- Menu Items
-- =========================
INSERT INTO menu_items
(created_at, description, image_url, is_available, name, price, stock_quantity, updated_at, category_id)
VALUES
(NOW(), 'Classic Indian masala chai', 'masala-chai.jpg', true, 'Masala Chai', 25.00, 100, NOW(), 1),
(NOW(), 'Fresh ginger flavored tea', 'ginger-tea.jpg', true, 'Ginger Tea', 22.00, 100, NOW(), 1),
(NOW(), 'Healthy green tea', 'green-tea.jpg', true, 'Green Tea', 30.00, 100, NOW(), 1),
(NOW(), 'Badam flavored tea', 'badam-tea.jpg', true, 'Badam Tea', 35.00, 100, NOW(), 1),
(NOW(), 'Honey infused tea', 'honey-tea.jpg', true, 'Honey Tea', 32.00, 100, NOW(), 1),
(NOW(), 'Fresh vegetable sandwich', 'veg-sandwich.jpg', true, 'Veg Sandwich', 60.00, 50, NOW(), 2),
(NOW(), 'Grilled cheese sandwich', 'cheese-sandwich.jpg', true, 'Cheese Sandwich', 70.00, 50, NOW(), 2),
(NOW(), 'Paneer sandwich with fresh stuffing', 'paneer-sandwich.jpg', true, 'Paneer Sandwich', 80.00, 50, NOW(), 2),
(NOW(), 'Crispy veg puff', 'veg-puff.jpg', true, 'Veg Puff', 30.00, 100, NOW(), 2),
(NOW(), 'Hot crispy samosa', 'samosa.jpg', true, 'Samosa', 20.00, 100, NOW(), 2)
ON CONFLICT DO NOTHING;