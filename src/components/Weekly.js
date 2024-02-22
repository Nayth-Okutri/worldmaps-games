import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { weeklyContests } from "../gameLevelConfig";
import { format, getISOWeek } from "date-fns";
const Weekly = ({ weekOfYear }) => {
  const navigate = useNavigate();
  const [contestOfTheWeek, setContestOfTheWeek] = useState();
  useEffect(() => {
    const currentDate = new Date();

    if (typeof weeklyContests[getISOWeek(currentDate)] !== "undefined")
      setContestOfTheWeek(weeklyContests[getISOWeek(currentDate)]);
    redirectToURL();
  }, [weekOfYear]);
  const redirectToURL = () => {
    const currentDate = new Date();
    console.log(getISOWeek(currentDate));
    console.log(contestOfTheWeek);
    console.log(contestOfTheWeek);
    if (typeof contestOfTheWeek !== "undefined")
      navigate(`/worldmaps/${contestOfTheWeek}`);
  };

  return <div></div>;
};
export default Weekly;
