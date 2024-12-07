import { onAuthStateChanged, User } from "firebase/auth";
import GameFC from "./GameFC";
import Board from "../logic/Board";
import Game from "../logic/Game";
import GameMode from "../models/GameMode";
import { useCallback, useEffect, useState } from "react";
import { auth, firestore } from "../logic/FirebaseConfig";
import UserStatus from "./UserStatus";
import { v4 as uuid } from "uuid";
import GameProp from "../models/GameProp";
import UserStats from "../models/UserStats";
import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  arrayUnion,
  onSnapshot,
  collection,
  where,
  getDocs,
  query,
  DocumentReference,
} from "firebase/firestore";
import GameJson, { fromGame, toGame } from "../models/GameJson";
import ShowStats from "./ShowStats";
import "../HomeFC.css";

interface HomeProps {}

/**
 * HomeFC Component - Main Menu for the Application.
 */
const HomeFC: React.FC<HomeProps> = ({}) => {
  const [user, setUser] = useState<User | null>(null);
  const [game, setGame] = useState<Game | null>(null);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [showStats, setShowStats] = useState<boolean>(false);
  const [gameDocRef, setGameDocRef] = useState<DocumentReference | null>(null);

  useEffect(() => {
    if (gameDocRef && user && user.uid !== "guest") {
      const unsubscribeGame = onSnapshot(gameDocRef, (docSnapshot) => {
        if (docSnapshot.exists()) {
          setGame(
            new Game(
              toGame(docSnapshot.data() as GameJson),
              user ? user.uid : "guest",
              onGameChange
            )
          );
        }
      });
      return () => unsubscribeGame();
    }
  }, [gameDocRef]);

  const setLoginUser = useCallback((newUser: User | null) => {
    setUser(newUser);
  }, []);

  const onGameChange = async (gameProp: GameProp): Promise<void> => {
    if (gameProp.winnerId !== null) {
      setGame(null);

      if (user) {
        const userDocRef = doc(firestore, "users", user.uid);
        if (userStats !== null) {
          const newStats: UserStats = { ...userStats };

          if (user.uid === gameProp.winnerId) {
            newStats.wins += 1;
            newStats.elo += 10;
          } else {
            newStats.losses += 1;
            newStats.elo -= 5;
          }

          newStats.played += 1;
          newStats.games.push(gameProp.uuid);

          // Update state and Firestore
          setUserStats(newStats);
          await updateDoc(userDocRef, {
            wins: newStats.wins,
            losses: newStats.losses,
            played: newStats.played,
            elo: newStats.elo,
            games: arrayUnion(gameProp.uuid),
          });
        }
      }
    }
    if (gameProp.mode === GameMode.ONLINE || gameProp.winnerId !== null) {
      const gameDocRef = doc(firestore, "games", gameProp.uuid);
      await setDoc(gameDocRef, fromGame(gameProp));
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const userDocRef = doc(firestore, "users", currentUser.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          setUserStats(userDoc.data() as UserStats);
        } else {
          const initialStats: UserStats = {
            wins: 0,
            losses: 0,
            played: 0,
            elo: 1000,
            games: [],
          };
          await setDoc(userDocRef, initialStats);
          setUserStats(initialStats);
        }
      } else {
        setUserStats(null);
      }
    });
    return () => unsubscribe();
  }, []);

  const handlePlayVsBot = () => {
    setGame(
      new Game(
        {
          uuid: uuid(),
          whitePlayerId: user ? user.uid : "guest",
          blackPlayerId: "bot",
          currentTurn: "white",
          winnerId: null,
          board: new Board(),
          whiteMovesCount: 0,
          blackMovesCount: 0,
          mode: GameMode.LOCAL,
          moveHistory: [],
        },
        user ? user.uid : "guest",
        onGameChange
      )
    );
  };

  const handleShowStats = () => {
    if (!user) {
      alert("Devi accedere per giocare online");
      return;
    }
    setShowStats(true);
  };

  const handlePlayOnline = async () => {
    if (!user) {
      alert("Devi accedere per giocare online");
      return;
    }

    // (blackPlayerId = "none")
    const gamesRef = collection(firestore, "games");
    const q = query(gamesRef, where("blackPlayerId", "==", "none"));
    const querySnapshot = await getDocs(q);

    // Check if there are available games
    if (!querySnapshot.empty) {
      const gameDoc = querySnapshot.docs[0];
      const gameData = gameDoc.data();
      const gameId = gameDoc.id;

      // Set myself as the black player
      await setDoc(doc(firestore, "games", gameId), {
        ...gameData,
        blackPlayerId: user.uid,
      });

      setGame(new Game(toGame(gameData as GameJson), user.uid, onGameChange));
      setGameDocRef(doc(firestore, "games", gameId)); // Set the gameDocRef

      return;
    }

    // Create a new game if no available games
    const newGame: Game = new Game(
      {
        uuid: uuid(),
        whitePlayerId: user.uid!, // UUID for the white player
        blackPlayerId: "none", // UUID for the black player
        currentTurn: "white",
        winnerId: null,
        board: new Board(),
        whiteMovesCount: 0,
        blackMovesCount: 0,
        mode: GameMode.ONLINE,
        moveHistory: [],
      },
      user.uid,
      onGameChange
    );
    setGame(newGame);
    await setDoc(
      doc(firestore, "games", newGame.getProp().uuid),
      fromGame(newGame.getProp())
    );

    // Add the new game to the waitingGames collection
    await setDoc(doc(firestore, "waitingGames", newGame.getProp().uuid), {
      gameId: newGame.getProp().uuid,
      player: user.uid,
    });

    setGameDocRef(doc(firestore, "games", newGame.getProp().uuid)); // Set the gameDocRef
  };

  const handlePlayWithFriend = () => {
    setGame(
      new Game(
        {
          uuid: uuid(),
          whitePlayerId: user ? user.uid : "guest", // UUID for the white player
          blackPlayerId: "guest2", // UUID for the black player
          currentTurn: "white",
          winnerId: null,
          board: new Board(),
          whiteMovesCount: 0,
          blackMovesCount: 0,
          mode: GameMode.LOCAL,
          moveHistory: [],
        },
        user ? user.uid : "guest",
        onGameChange
      )
    );
  };

  return (
    <table className="table-container">
      <tbody>
        <tr>
          <td height="75vh" className="left-bar">
            <UserStatus setLoginUser={setLoginUser} />
          </td>
          <td rowSpan={2}>
            {showStats ? (
              <>
                <ShowStats key="user" user={user} userStats={userStats} />
              </>
            ) : game ? (
              <>
                <GameFC key="game" game={game} />
              </>
            ) : (
              <>
                <button onClick={handlePlayOnline}>Play Online</button>
                <br />
                <br />
                <button onClick={handlePlayVsBot}>Play vs Bot</button>
                <br />
                <br />
                <button onClick={handlePlayWithFriend}>Play with Friend</button>
                <br />
                <br />
                <button onClick={handleShowStats}>Show Stats</button>
              </>
            )}
          </td>
        </tr>
        <tr>
          <td height="25vh" className="left-bar">
            {(game!==null || showStats) ? (
              <button
                onClick={() => {
                  setGame(null);
                  setShowStats(false);
                }}
              >
                Home
              </button>
            ) : (
              ""
            )}
          </td>
        </tr>
      </tbody>
    </table>
  );
};

export default HomeFC;
