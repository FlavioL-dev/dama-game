import { useEffect, useState } from "react";
import { auth } from "../logic/FirebaseConfig";
import { User } from "firebase/auth";
import Login from "./Login";
import React from "react";
import "../UserStatus.css";

interface UserProps {
  setLoginUser: (user: User | null) => void;
}

const UserStatus: React.FC<UserProps> = React.memo(({ setLoginUser }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="user-container">
      {user ? (
        <div className="user-info">
          <img
            className="user-avatar"
            src={user.photoURL === null ? undefined : user.photoURL}
            alt="User Avatar"
          />
          <p className="welcome-message">Benvenuto, {user.displayName}!</p>
        </div>
      ) : (
        <div>
          <p className="login-container">Non sei loggato.</p>
          <Login setUser={setLoginUser} />
        </div>
      )}
    </div>
  );
});

export default UserStatus;
