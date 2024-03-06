import React, { useEffect } from "react";
import { Chart as ChartJS } from "chart.js/auto";
import { Line, Bar, Doughnut } from "react-chartjs-2";
import { Pie, PolarArea, Radar } from "react-chartjs-2";

import classes from "./Stats.module.css";
import { useDispatch, useSelector } from "react-redux";
import { CategoryScale } from "chart.js";
import { userActions } from "../store/user";
import { getContactsRoute } from "../api/userApi";
import { getMessagesRoute } from "../api/messageApi";
import { toast } from "react-toastify";
import { toastOptions } from "../utils/utility";
import { useState } from "react";

ChartJS.register(CategoryScale);

const Stats = () => {
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.user.user);
  const contacts = useSelector((state) => state.user.contacts);

  const [messageCount, setMessageCount] = useState([]);
  useEffect(() => {
    const getContacts = async () => {
      try {
        if (userData) {
          const response = await getContactsRoute(userData._id);
          if (response.data.status === "failed") {
            toast.error("Failed to fetch contacts", toastOptions);
          } else {
            dispatch(userActions.setUserContacts(response.data.contacts));
          }
          let tempMessageCount = [];
          for (let i = 0; i < response.data.contacts.length; i++) {
            const messageResponse = await getMessagesRoute({
              from: userData._id,
              to: response.data.contacts[i]._id,
            });
            if (messageResponse.data.status === "failed") {
              toast.error("Failed to fetch messages", toastOptions);
            } else {
              tempMessageCount.push(messageResponse.data.messages.length);
            }
          }
          setMessageCount(tempMessageCount);
        }
      } catch (error) {
        console.log(error);
      }
    };
    getContacts();
  }, [userData, dispatch]);

  return (
    <div className={classes["main-container"]}>
      <div className={classes["chart-3"]}>
        <Doughnut
          data={{
            labels: contacts.map((contact) => contact.username),
            datasets: [
              {
                label: "Messages",
                data: messageCount,
              },
            ],
          }}
        />
      </div>
      <div className={classes["chart-1"]}>
        <Bar
          data={{
            labels: contacts.map((contact) => contact.username),
            datasets: [
              {
                label: "Messages",
                data: messageCount,
              },
            ],
          }}
        />
      </div>
      <div className={classes["chart-2"]}>
        <Line
          data={{
            labels: contacts.map((contact) => contact.username),
            datasets: [
              {
                label: "Messages",
                data: messageCount,
              },
            ],
          }}
        />
      </div>

      <div className={classes["chart-5"]}>
        <Pie
          data={{
            labels: contacts.map((contact) => contact.username),
            datasets: [
              {
                label: "Messages",
                data: messageCount,
              },
            ],
          }}
        />
      </div>
      <div className={classes["chart-6"]}>
        <PolarArea
          data={{
            labels: contacts.map((contact) => contact.username),
            datasets: [
              {
                label: "Messages",
                data: messageCount,
              },
            ],
          }}
        />
      </div>
      <div className={classes["chart-7"]}>
        <Radar
          data={{
            labels: contacts.map((contact) => contact.username),
            datasets: [
              {
                label: "Messages",
                data: messageCount,
              },
            ],
          }}
        />
      </div>
    </div>
  );
};

export default Stats;
