import { useState } from "react";
import { Button } from "@mui/material";
import { useCookies } from "react-cookie";

const Auth = () => {
  const [cookies, setCookie, removeCookie] = useCookies("");
  const [isLogIn, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState(null);

  const viewLogin = (status) => {
    setError(null);
    setIsLogin(status);
  };

  const handleSubmit = async (e, endpoint) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Email and password are required");
      return;
    }

    if (!isLogIn && password !== confirmPassword) {
      setError("Passwords must match");
      return;
    }
    const response = await fetch(
      `${process.env.REACT_APP_SERVER_URL}/${endpoint}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      }
    );

    const data = await response.json();

    if (data.detail) {
      setError(data.detail);
    } else {
      setCookie("Email", data.email);
      setCookie("AuthToken", data.token);
    }
  };
  return (
    <div className="auth-container">
      <div className="auth-container-box">
        <form onSubmit={(e) => handleSubmit(e, isLogIn ? "login" : "signup")}>
          <h2>{isLogIn ? "Please Log In" : "Please Sign Up"}</h2>
          <input
            type="email"
            placeholder="email"
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="password"
            onChange={(e) => setPassword(e.target.value)}
          />
          {!isLogIn && (
            <input
              type="password"
              placeholder="confirm password"
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          )}
          <input type="submit" />
        </form>
        {error && (
          <p
            style={{
              color: "#fff",
              backgroundColor: "#fb0e0e8f",
              padding: "0.5rem 0",
              borderRadius: "1rem",
              textAlign: "center",
              margin: "2rem 1rem 0",
            }}
          >
            {error}
          </p>
        )}
        <div className="auth-options">
          <Button variant="outlined" onClick={() => viewLogin(false)}>
            Sign Up
          </Button>
          <Button variant="outlined" onClick={() => viewLogin(true)}>
            Log In
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Auth;
