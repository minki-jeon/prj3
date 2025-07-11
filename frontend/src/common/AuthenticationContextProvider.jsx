import { createContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

// 유효 기간이 지난 토큰 삭제
const token = localStorage.getItem("token");
if (token) {
  const decoded = jwtDecode(token);
  const exp = decoded.exp;
  if (exp * 1000 < Date.now()) {
    localStorage.removeItem("token");
  }
}

// axios interceptor
// 모든 axios 요청 작업에서, token이 존재하면 Authorization header에 'Bearer token' 붙이기
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

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
