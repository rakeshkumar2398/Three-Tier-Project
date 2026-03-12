import { useState } from "react";
import api from "../services/api";

function Cart({ cart, setCart, currentUser }) {
  const [message, setMessage] = useState("");
  const [orderId, setOrderId] = useState(null);
  const [paymentMessage, setPaymentMessage] = useState("");

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const increaseQuantity = (id) => {
    const updatedCart = cart.map((item) =>
      item.id === id
        ? { ...item, quantity: item.quantity + 1 }
        : item
    );
    setCart(updatedCart);
  };

  const decreaseQuantity = (id) => {
    const updatedCart = cart
      .map((item) =>
        item.id === id
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
      .filter((item) => item.quantity > 0);

    setCart(updatedCart);
  };

  const removeItem = (id) => {
    const updatedCart = cart.filter((item) => item.id !== id);
    setCart(updatedCart);
  };

  const placeOrder = async () => {
    if (!currentUser) {
      setMessage("Please create or select a user first.");
      setPaymentMessage("");
      return;
    }

    const orderData = {
      userId: currentUser.id,
      deliveryType: "TAKEAWAY",
      items: cart.map((item) => ({
        menuItemId: item.id,
        quantity: item.quantity
      }))
    };

    try {
      const response = await api.post("/api/orders", orderData);

      console.log("Order response:", response.data);

      const createdOrderId =
        response.data?.id ||
        response.data?.orderId ||
        response.data?.order?.id;

      setOrderId(createdOrderId);

      setMessage(
        "Order placed successfully! Order ID: " +
          (createdOrderId ? createdOrderId : "Created")
      );

      setPaymentMessage("");
    } catch (error) {
      console.error("Order error:", error);

      const backendMessage =
        error.response?.data?.message ||
        error.response?.data ||
        "Order failed";

      setMessage(backendMessage);
      setPaymentMessage("");
    }
  };

  const makePayment = async () => {
    if (!orderId) {
      setPaymentMessage("Order ID not found. Please place order first.");
      return;
    }

    const paymentData = {
      orderId: orderId,
      paymentMethod: "UPI"
    };

    try {
      const response = await api.post("/api/payments", paymentData);

      console.log("Payment response:", response.data);

      setPaymentMessage("Payment completed successfully!");
      setCart([]);
      setOrderId(null);
      setMessage("");
    } catch (error) {
      console.error("Payment error:", error);

      const backendMessage =
        error.response?.data?.message ||
        error.response?.data ||
        "Payment failed";

      setPaymentMessage(backendMessage);
    }
  };

  return (
    <div style={{ marginTop: "40px" }}>
      <h2>Cart</h2>

      {currentUser && (
        <p style={{ fontWeight: "bold", color: "#444" }}>
          Ordering as: {currentUser.name} (User ID: {currentUser.id})
        </p>
      )}

      {cart.length === 0 && !paymentMessage && <p>No items in cart</p>}

      {cart.map((item) => (
        <div
          key={item.id}
          style={{
            border: "1px solid #ddd",
            borderRadius: "10px",
            padding: "15px",
            marginBottom: "15px",
            width: "300px",
            boxShadow: "0 2px 5px rgba(0,0,0,0.1)"
          }}
        >
          <h3>{item.name}</h3>
          <p>Price: ₹{item.price}</p>

          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <button
              onClick={() => decreaseQuantity(item.id)}
              style={{
                padding: "5px 10px",
                border: "none",
                background: "#ccc",
                borderRadius: "5px",
                cursor: "pointer"
              }}
            >
              -
            </button>

            <span>{item.quantity}</span>

            <button
              onClick={() => increaseQuantity(item.id)}
              style={{
                padding: "5px 10px",
                border: "none",
                background: "#ccc",
                borderRadius: "5px",
                cursor: "pointer"
              }}
            >
              +
            </button>
          </div>

          <p style={{ marginTop: "10px" }}>
            Subtotal: ₹{item.price * item.quantity}
          </p>

          <button
            onClick={() => removeItem(item.id)}
            style={{
              padding: "8px 12px",
              background: "red",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer"
            }}
          >
            Remove Item
          </button>
        </div>
      ))}

      {cart.length > 0 && (
        <>
          <h3>Total: ₹{total}</h3>

          <button
            onClick={placeOrder}
            style={{
              padding: "10px",
              background: "green",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              marginRight: "10px"
            }}
          >
            Place Order
          </button>

          {orderId && (
            <button
              onClick={makePayment}
              style={{
                padding: "10px",
                background: "#8b4513",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer"
              }}
            >
              Pay Now
            </button>
          )}
        </>
      )}

      {message && (
        <p
          style={{
            marginTop: "15px",
            fontWeight: "bold",
            color: message.toLowerCase().includes("success") ? "green" : "red"
          }}
        >
          {message}
        </p>
      )}

      {paymentMessage && (
        <div style={{ marginTop: "20px", color: "green", fontWeight: "bold" }}>
          <h3>Order Confirmed ✅</h3>
          <p>{paymentMessage}</p>
          <p>Thank you for ordering from ChaiKafe ☕</p>
        </div>
      )}
    </div>
  );
}

export default Cart;