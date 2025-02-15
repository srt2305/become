import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { UserId } from "../context/UserIdContext";
import Loading from "./Loading";
const style = require("../styles/all-leaderboard.module.css").default;
const coinImage = require("../assets/svg/coin.svg").default;

function AllUsersLeaderBoard() {
  const [topLeaderboardUsers, setTopLeaderboardUsers] = useState<any>([]);
  const [isLoading, setIsLoading] = useState<any>(true);

  const userData: any = localStorage.getItem("userInfo");
  const data = JSON.parse(userData);
  let userId = data?.userId;

  const fetchAllUserDetails = async () => {
    try {
      const response: any = await fetch(
        `${process.env.REACT_APP_API_URL}/all-user`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        }
      );
      if (!response.ok) throw new Error("Error while fetching users");
      if (response) {
        const jsonData = await response.json();
        const data = jsonData
          .map((eachData: any) => {
            return eachData;
          })
          .sort((a: any, b: any) => b.total_coins - a.total_coins);
        setTopLeaderboardUsers(data);
      }
    } catch (err) {
      console.log("Error while fetching users");
      console.error(err);
    }
  };

  const Leaderboard = ({ eachLeaderBoardUser, count }: any) => {
    const navigator = useNavigate();
    const { user_id, name, total_coins } = eachLeaderBoardUser;

    const handleClickLeaderboard = () => {
      navigator(`/user/${user_id}`);
    };

    return (
      <>
        <div className={style["leaderboard"]}>
          <div className={style["values"]}>
            <div className={style["leaderboard-number"]}>{count}</div>
            <button
              onClick={handleClickLeaderboard}
              className={style["values__content"]}
            >
              {name}
            </button>
            <div className={style["values__content-right"]}>
              <div className={style["values__content-coin"]}>
                <img src={coinImage} alt="" />
              </div>
              <div className={style["values__content-value"]}>
                {/* {total_coins < 10 ? "0" + total_coins : total_coins} */}
                {total_coins}
              </div>
            </div>
          </div>
        </div>
      </>
    );
  };

  useEffect(() => {
    fetchAllUserDetails()
      .then(() => {
        console.log("User details fetched");
        setIsLoading(false);
      })
      .catch((error) => {
        console.log("Error in fetching user details", error);
      });
  }, []);

  if (isLoading) return <Loading />;

  return (
    <>
      <div className={style["allUsers__leaderboard"]}>
        <Header
          navigateTo={`/my-profile/${userId}`}
          content={"Back to Profile"}
        />
        <div className={style["leaderboard__heading"]}>LEADERBOARD</div>
        <div className={style["leaderboard__Users"]}>
          {topLeaderboardUsers &&
            topLeaderboardUsers.map((eachLeaderBoardUser: any, index: any) => {
              return (
                <Leaderboard
                  key={index}
                  count={index + 1}
                  eachLeaderBoardUser={eachLeaderBoardUser}
                />
              );
            })}
        </div>
      </div>
    </>
  );
}

export default AllUsersLeaderBoard;
