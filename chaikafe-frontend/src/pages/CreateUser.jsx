import { useState } from "react";
import axios from "axios";

function CreateUser({ onUserCreated }) {
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
    role: "CUSTOMER",
    phone: "",
    address: "",
  });

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:8080/api/users", user);
      alert("User created successfully");

      if (onUserCreated) {
        onUserCreated(response.data);
      }

      setUser({
        name: "",
        email: "",
        password: "",
        role: "CUSTOMER",
        phone: "",
        address: "",
      });
    } catch (error) {
      console.error("Error creating user:", error);
      alert("Failed to create user");
    }
  };

  return (
    <div style={{ marginBottom: "20px" }}>
      <h2>Create User</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={user.name}
          onChange={handleChange}
          required
        />
        <br /><br />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={user.email}
          onChange={handleChange}
          required
        />
        <br /><br />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={user.password}
          onChange={handleChange}
          required
        />
        <br /><br />

        <input
          type="text"
          name="phone"
          placeholder="Phone"
          value={user.phone}
          onChange={handleChange}
        />
        <br /><br />

        <input
          type="text"
          name="address"
          placeholder="Address"
          value={user.address}
          onChange={handleChange}
        />
        <br /><br />

        <button type="submit">Create User</button>
      </form>
    </div>
  );
}

export default CreateUser;