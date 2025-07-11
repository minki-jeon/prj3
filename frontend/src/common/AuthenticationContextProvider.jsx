import { createContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

// step1. create context
const AuthenticationContext = createContext(null);

export function AuthenticationContextProvider({ children }) {
  // email + nickName
  // login + logout
  // hasAccess
  // isAdmin
  const [user, setUser] = useState(null);
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const payload = jwtDecode(token);
      axios.get("/api/member?email=" + payload.sub).then((res) => {
        setUser({
          email: res.data.email,
          nickName: res.data.nickName,
        });
      });
    }
  }, []);

  function login(token) {
    localStorage.setItem("token", token);

    const payload = jwtDecode(token);
    axios.get("/api/member?email=" + payload.sub).then((res) => {
      setUser({
        email: res.data.email,
        nickName: res.data.nickName,
      });
    });
  }

  function logout() {
    localStorage.removeItem("token");
    setUser(null);
  }

  // step3. provide context
  return (
    <AuthenticationContext value={{ user: user, login: login, logout: logout }}>
      {children}
    </AuthenticationContext>
  );
}

export { AuthenticationContext };
