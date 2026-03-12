import { useEffect, useState } from "react";
import api from "../services/api";

function Menu({ cart, setCart }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/api/menu-items")
      .then((response) => {
        setItems(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching menu items:", error);
        setLoading(false);
      });
  }, []);

  const addToCart = (item) => {
    const existingItem = cart.find((cartItem) => cartItem.id === item.id);

    if (existingItem) {
      const updatedCart = cart.map((cartItem) =>
        cartItem.id === item.id
          ? { ...cartItem, quantity: cartItem.quantity + 1 }
          : cartItem
      );
      setCart(updatedCart);
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
  };

  return (
    <div style={{ marginTop: "30px" }}>
      <h2 style={{ marginBottom: "20px" }}>Menu</h2>

      {loading && <p>Loading menu items...</p>}

      {!loading && items.length === 0 && <p>No menu items available.</p>}

      <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
        {items.map((item) => (
          <div
            key={item.id}
            style={{
              border: "1px solid #ddd",
              borderRadius: "12px",
              padding: "16px",
              width: "240px",
              backgroundColor: "#fffaf5",
              boxShadow: "0 3px 8px rgba(0,0,0,0.08)"
            }}
          >
            <h3 style={{ marginBottom: "10px", color: "#5c2e00" }}>
              {item.name}
            </h3>

            <p style={{ minHeight: "40px", color: "#555" }}>
              {item.description}
            </p>

            <p style={{ fontWeight: "bold", marginBottom: "8px" }}>
              Price: ₹{item.price}
            </p>

            <p style={{ marginBottom: "12px" }}>
              {item.isAvailable ? "Available" : "Not Available"}
            </p>

            <button
              onClick={() => addToCart(item)}
              disabled={!item.isAvailable}
              style={{
                padding: "10px 14px",
                backgroundColor: item.isAvailable ? "#8b4513" : "#999",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: item.isAvailable ? "pointer" : "not-allowed",
                width: "100%"
              }}
            >
              {item.isAvailable ? "Add to Cart" : "Unavailable"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Menu;