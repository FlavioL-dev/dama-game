import { signInWithPopup, User } from "firebase/auth";
import { auth, provider } from "../logic/FirebaseConfig";

interface LoginProps {
  setUser: (user: User | null) => void;
}

const Login: React.FC<LoginProps> = ({ setUser }) => {
  const handleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      console.log("User Info: ", user);
      setUser(user);
    } catch (error) {
      console.error("Errore durante il login: ", error);
    }
  };

  return <button onClick={handleLogin}>Accedi con Google</button>;
};

export default Login;
