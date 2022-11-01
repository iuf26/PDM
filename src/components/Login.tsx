import axios from "axios";
import React, { useState } from "react";
import { Redirect } from "react-router-dom";
import { ItemList } from "../todo";
import { baseUrl } from "../todo/itemApi";

export function Login() {
  const [username, setUsername] = useState("");
  const [pass, setPass] = useState("");
  const [okLogin, setOkLogin] = useState(false);

  const doLogin = () => {
    axios
      .post(`http://localhost:3000/login`, {
        user: username,
        pass,
      })
      .then((res) => {
        if (res.status === 200) {
          localStorage.setItem("token", res.data.token);
          setOkLogin(true);
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
