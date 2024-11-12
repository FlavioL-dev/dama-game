import { onAuthStateChanged, User } from "firebase/auth";
import GameFC from "./GameFC";
import Board from "../logic/Board";
import Game from "../logic/Game";
import GameMode from "../models/GameMode";
import { useEffect, useState } from "react";
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
} from "firebase/firestore";
import GameJson, { fromGame, toGame } from "../models/GameJson";
import ShowStats from "./ShowStats";

interface HomeProps {}

const HomeFC: React.FC<HomeProps> = ({}) => {
  const [user, setUser] = useState<User | null>(null);
  const [game, setGame] = useState<Game | null>(null);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [showStats, setShowStats] = useState<boolean>(false);

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

    if (!querySnapshot.empty) {
      const gameDoc = querySnapshot.docs[0];
      const gameData = gameDoc.data();
      const gameId = gameDoc.id;

      await setDoc(doc(firestore, "games", gameId), {
        ...gameData,
        blackPlayerId: user.uid,
      });

      setGame(new Game(toGame(gameData as GameJson), user.uid, onGameChange));

      const gameDocRef = doc(firestore, "games", gameId);

      useEffect(() => {
        const unsubscribeGame = onSnapshot(
          gameDocRef,
          (docSnapshot) => {
            if (docSnapshot.exists()) {
              setGame(
                new Game(
                  toGame(docSnapshot.data() as GameJson),
                  user.uid,
                  onGameChange
                )
              );
            }
          }
        );
        return () => unsubscribeGame();
      }, [gameDocRef]);
      return;
    }
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

    // Aggiungi l'UUID della nuova partita nella lista delle partite in attesa
    await setDoc(doc(firestore, "waitingGames", newGame.getProp().uuid), {
      gameId: newGame.getProp().uuid,
      player: user.uid,
    });

    const gameDocRef = doc(firestore, "games", newGame.getProp().uuid);

    useEffect(() => {
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
    }, [gameDocRef]);
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
    <table>
      <tbody>
        <tr>
          <td width="20%" height={"25%"} className="left-bar">
            <h1
              onClick={() => {
                setGame(null);
                setShowStats(false);
              }}
            >
              {" "}
              Home{" "}
            </h1>
          </td>
          <td width={"80%"} rowSpan={2} height={"100%"}>
            {showStats ? (
              <>
                <ShowStats user={user} userStats={userStats} />
              </>
            ) : game ? (
              <>
                <GameFC game={game} key="game" />
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
          <td height="75%" className="left-bar">
            <UserStatus setLoginUser={setUser} />
          </td>
        </tr>
      </tbody>
    </table>
  );
};

export default HomeFC;
