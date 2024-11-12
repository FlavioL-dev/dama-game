import { useEffect, useState } from "react";
import { auth } from "../logic/FirebaseConfig";
import { User } from "firebase/auth";
import Login from "./Login";

interface UserProps {
  setLoginUser: (user: User | null) => void;
}

const UserStatus: React.FC<UserProps> = ({ setLoginUser }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  return (
    <div>
      {user ? (
        <div>
          <img
            src={user.photoURL === null ? undefined : user.photoURL}
            alt="User Avatar"
          />
          <p>Benvenuto, {user.displayName}!</p>
        </div>
      ) : (
        <>
          <p>Non sei loggato.</p>
          <Login setUser={setLoginUser} />
        </>
      )}
    </div>
  );
};

export default UserStatus;
