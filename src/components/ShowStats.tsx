import { User } from "firebase/auth";
import UserStats from "../models/UserStats";
import { useEffect, useState } from "react";
import GameJson from "../models/GameJson";
import { collection, getDocs, query, where } from "firebase/firestore";
import { firestore } from "../logic/FirebaseConfig";

interface ShowStatsProps {
  user: User | null;
  userStats: UserStats | null;
}

const ShowStats: React.FC<ShowStatsProps> = ({ user, userStats }) => {
  const [userGames, setUserGames] = useState<GameJson[]>([]);

  const fetchUserGames = async (userId: string) => {
    const gamesRef = collection(firestore, "games");
    const whiteQuery = query(gamesRef, where("whitePlayerId", "==", userId));
    const blackQuery = query(gamesRef, where("blackPlayerId", "==", userId));

    const userGamesData: any[] = [];
    const whiteSnapshot = await getDocs(whiteQuery);
    whiteSnapshot.forEach((doc) => userGamesData.push(doc.data()));

    const blackSnapshot = await getDocs(blackQuery);
    blackSnapshot.forEach((doc) => userGamesData.push(doc.data()));

    setUserGames(userGamesData);
  };

  const calculateValues = () => {
    let counter = 0;
    let sum = 0;
    let min = Number.POSITIVE_INFINITY;
    let max = 0;
    for (let i = 0; i < userGames.length; i++) {
      if (
        userGames[i].whitePlayerId === user?.uid &&
        userGames[i].winnerId !== null
      ) {
        counter++;
        sum += userGames[i].whiteMovesCount;
        min = Math.min(min, userGames[i].whiteMovesCount);
        max = Math.max(max, userGames[i].whiteMovesCount);
      }
      if (
        userGames[i].blackPlayerId === user?.uid &&
        userGames[i].winnerId !== null
      ) {
        counter++;
        sum += userGames[i].blackMovesCount;
        min = Math.min(min, userGames[i].blackMovesCount);
        max = Math.max(max, userGames[i].blackMovesCount);
      }
    }
    return [
      counter === 0 ? 0 : min,
      counter === 0 ? 0 : sum / counter,
      max,
      userGames.length,
    ];
  };

  useEffect(() => {
    if (user) {
      fetchUserGames(user.uid);
    }
  }, [user]);

  const values = calculateValues();

  return (
    <>
      <h2>Statistiche Utente</h2>
      {user && userStats ? (
        <div>
          <p>
            <strong>Partite Giocate (Completate):</strong> {userStats.played}
          </p>
          <p>
            <strong>Partite Iniziate (Non Completate):</strong> {values[3]}
          </p>
          <p>
            <strong>Vittorie:</strong> {userStats.wins}
          </p>
          <p>
            <strong>Sconfitte:</strong> {userStats.losses}
          </p>
          <p>
            <strong>Punteggio Elo:</strong> {userStats.elo}
          </p>
          <p>
            <strong>Numero Mosse (min, avg, max):</strong> {values[0]} /{" "}
            {values[1].toFixed(2)} / {values[2]}
          </p>
        </div>
      ) : (
        <p>Accedi per vedere le tue statistiche.</p>
      )}
    </>
  );
};

export default ShowStats;
