import axios from "axios";
import React, { useContext, useState } from "react";
import { Redirect } from "react-router-dom";
import { AppContext } from "./AppContext";
import { Plugins } from "@capacitor/core";
import { AuthContext } from "./AuthProvider";
const { Storage } = Plugins;

export function Login() {
  const [username, setUsername] = useState("");
  const [pass, setPass] = useState("");
  const [okLogin, setOkLogin] = useState(false);
  const { userId, setUserId } = useContext(AppContext);
  const { login, isAuthenticated } = useContext(AuthContext);
  const setStoreUserId = async (id: string) => {
    await Storage.set({
      key: "userId",
      value: id,
    });
  };
  const doLogin = () => {
    axios
      .post(`http://localhost:3000/login`, {
        user: username,
        pass,
      })
      .then((res) => {
        if (res.status === 200) {
          setUserId(res.data.userId);
          setStoreUserId(res.data.userId.toString());
          localStorage.setItem("userId", res.data.userId);
          localStorage.setItem("token", res.data.token);
          localStorage.setItem("net", "true");
          if (login) login();
         
          setOkLogin(true);
          // if (login) {
          //   login().then((resp) =>{console.log("******")});
          // }
        } else {
          console.log("Invalid account");
        }
      })
      .catch((e) => console.log(e));
  };

  return (
    <>
      {!okLogin && !localStorage.getItem("token") ? (
        <div>
          Hello,user!
          <input
            type="text"
            id="username"
            onChange={(ev) => {
              setUsername(ev.target.value);
            }}
          ></input>
          <input
            type="password"
            id="password"
            onChange={(ev) => {
              setPass(ev.target.value);
            }}
          ></input>
          <button onClick={doLogin}>Log in</button>
        </div>
      ) : (
        <Redirect to="/items" />
      )}
    </>
  );
}
