import { useState } from "react";
import Menu from "./pages/Menu";
import Cart from "./pages/Cart";
import CreateUser from "./pages/CreateUser";

function App() {
  const [cart, setCart] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  return (
    <div>
      <h1>ChaiKafe ☕</h1>

      <CreateUser onUserCreated={setCurrentUser} />

      {currentUser && (
        <p>
          Current User: {currentUser.name} (ID: {currentUser.id})
        </p>
      )}

      <Menu cart={cart} setCart={setCart} />
      <Cart cart={cart} setCart={setCart} currentUser={currentUser} />
    </div>
  );
}

export default App;