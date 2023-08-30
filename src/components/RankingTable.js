import "../styles/RankingTable.css";
import {
  GAME_MODE_DUPLICATE,
  GAME_MODE_10_QUESTS,
  GAME_MODE_TIMEATTACK,
  GAME_MODE_ALLQUESTS,
} from "./Constants";
const RankingTable = ({ gameMode, displayedLeaderboardData }) => {
  return (
    <div className="data">
      {gameMode === GAME_MODE_DUPLICATE && (
        <h1>High scores for the mode Duplicate Hunt</h1>
      )}
      {gameMode === GAME_MODE_10_QUESTS && (
        <h1>High scores for the mode Random 10 Quests</h1>
      )}
      {gameMode === GAME_MODE_TIMEATTACK && (
        <h1>High scores for the mode Time Attack</h1>
      )}
      {gameMode === GAME_MODE_ALLQUESTS && (
        <h1>High scores for the mode Otaku Mastery</h1>
      )}

      <table>
        <thead>
          <tr>
            <th>RANK</th>
            <th>NAME</th>
            <th>SCORE</th>
            <th>TIME (SECONDS)</th>
          </tr>
        </thead>
        <tbody>
          {displayedLeaderboardData &&
            displayedLeaderboardData.map((data, index) => {
              const rank = index + 1; // Rank starts from 1
              const isHighlight = index === 0;
              return (
                <tr key={data.name}>
                  <td>
                    {rank}
                    {isHighlight && (
                      <img
                        src={require("../assets/ChampionIcon.png")}
                        className="rank-image"
                        alt="crown"
                        style={{ height: "15px", width: "auto" }}
                      />
                    )}
                  </td>
                  <td>{data.name}</td>
                  <td>{data.score}</td>
                  <td>{data.time}</td>
                </tr>
              );
            })}
        </tbody>
      </table>
    </div>
  );
};
export default RankingTable;
