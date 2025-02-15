import React, { useCallback, useContext, useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "../components/Header";
import ProfileWithCoin from "../components/ProfileWithCoin";
import Button from "../components/Button";
import { useNavigate, useParams } from "react-router-dom";
import { UserId } from "../context/UserIdContext";
import Loading from "./Loading";

const styles = require("../styles/sendPage.module.css").default;
const coin = require("../assets/svg/big-coin.svg").default;

interface User {
  user_id: string;
  name: string;
  coins: number;
}

export default function SendPage() {
  const [selectedOption, setSelectedOption] = useState<string>("Tenacious");
  const [celebrationMoment, setCelebrationMoment] = useState<string>("");
  const [user, setUser] = useState({} as any);
  const [isLoading, setIsLoading] = useState<any>(true);

  const { id } = useParams();
  const navigator = useNavigate();
  const userData: any = localStorage.getItem("userInfo");
  const data = JSON.parse(userData);
  let userId = data?.userId;

  const findUserValid = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/valid-user`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
          body: JSON.stringify({
            from_user_id: userId,
            to_user_id: id,
            value: selectedOption,
          }),
        }
      );
      if (response.ok) {
        const result = await response.json();
        return result.isValidUser;
      }
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  const handleOnChangeForTextArea = (e: any) => {
    const userInput = e.target.value;
    if (userInput.length <= 300) {
      setCelebrationMoment(userInput);
    } else {
      toast.error("character limit exceeded", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    }
  };

  const sendCoins = async () => {
    if (celebrationMoment.length <= 25) {
      toast.warn("minimum character limit is 25", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
      return;
    }
    if (data.coins <= 0) {
      toast.warn("you don't have enough coins", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
      return;
    }
    try {
      const isValidUser = await findUserValid();
      if (!isValidUser) {
        toast.warn("you cannot send same value more than 1 time", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
        return;
      }
      setIsLoading(true);
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/make-transaction`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
          body: JSON.stringify({
            from: data.userName,
            from_user_id: data.userId,
            to: user.name,
            to_user_id: id,
            celebration_moment: selectedOption.toLocaleLowerCase(),
            celebrating_value: celebrationMoment,
            image: data.image,
          }),
        }
      );
      if (response.ok) {
        toast.success("Transaction completed!", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
        setIsLoading(true);
        setTimeout(() => {
          // setIsLoading(false);
          navigator(`/my-profile/${userId}`);
        }, 500);
      } else {
        setIsLoading(false);
        toast.error("internel server error", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
      }
    } catch (err) {
      console.log("Error while sending coins");
      console.error(err);
    }
  };

  const fetchAllUsers = useCallback(async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/all-user`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        }
      );
      if (response) {
        const jsonData = await response.json();
        const user = jsonData.find((eachUser: User) => eachUser.user_id === id);
        if (user) {
          setUser(user);
        } else {
          console.log("User not found");
        }
      }
    } catch (err) {
      console.log("Error while fetching users");
      console.error(err);
    }
  }, [id]);

  useEffect(() => {
    fetchAllUsers()
      .then(() => {
        console.log("Fetched all users successfully");
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [fetchAllUsers]);

  if (isLoading) return <Loading />;

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        draggable
        theme="dark"
      />
      <div className={styles["sendPage"]}>
        <div className={styles["sendPage__header"]}>
          <Header
            navigateTo={"/profile"}
            content={"Who do you want to Celebrate?"}
          />
        </div>
        <div className={styles["sendPage__content"]}>
          <div className={styles["sendPage__content-user-info"]}>
            <div className={styles["sendpage__content-profile"]}>
              <ProfileWithCoin userDetails={user} />
            </div>
            <div className={styles["sendpage__content-coin"]}>
              <img src={coin} alt="" />
              <div className={styles["sendpage__content-coin-amount"]}>
                +1 Coin
              </div>
            </div>
          </div>
          <div className={styles["sendPage__content-input"]}>
            <div className={styles["sendPage__content-radio"]}>
              <label>Select the value you’re celebrating:</label>
              <select
                id="cars"
                onChange={(e) => {
                  setSelectedOption(e.target.value);
                  console.log(e.target.value);
                }}
                value={selectedOption}
              >
                <option className="options" value="Tenacious">
                  Tenacious
                </option>
                <option className="options" value="Resourceful">
                  Resourceful
                </option>
                <option className="options" value="Open_Minded">
                  Open Minded
                </option>
                <option className="options" value="Problem_Solving">
                  Problem Solving
                </option>
                <option className="options" value="Holistic">
                  Holistic
                </option>
                <option className="options" value="Inquisitive">
                  Inquisitive
                </option>
                <option className="options" value="Celebrating">
                  Celebrating
                </option>
              </select>
            </div>
            <div className={styles["sendPage__content-text"]}>
              <label htmlFor="">{`Share the moment of Celebration: (Character count ${celebrationMoment.length})`}</label>
              <textarea
                name="Text1"
                cols={60}
                onChange={(e) => handleOnChangeForTextArea(e)}
                value={celebrationMoment}
                placeholder="Type the reason..."
                rows={8}
              ></textarea>
            </div>
            <div className={styles["sendPage__content-button"]}>
              <Button handleClick={sendCoins} content={"Celebrate Becoming"} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
