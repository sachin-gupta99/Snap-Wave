import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Chart as ChartJS, defaults } from "chart.js/auto";
import { Line, Bar, Doughnut, Pie, PolarArea, Radar } from "react-chartjs-2";
import { CategoryScale } from "chart.js";
import { toast } from "react-toastify";

import classes from "./Stats.module.css";
import { userActions } from "../store/user";
import { getContactsRoute } from "../api/userApi";
import { getMessagesRoute } from "../api/messageApi";
import { toastOptions } from "../utils/utility";

ChartJS.register(CategoryScale);
defaults.maintainAspectRatio = false;
defaults.responsive = true;

ChartJS.defaults.plugins.title.display = true;
ChartJS.defaults.plugins.title.align = "center";
ChartJS.defaults.plugins.title.color = "#4acf4a";
ChartJS.defaults.plugins.title.font.size = 10;
ChartJS.defaults.plugins.title.font.family = "Josefin Sans, sans-serif";
ChartJS.defaults.plugins.title.padding = 5;

const Stats = () => {
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.user.user);
  const contacts = useSelector((state) => state.user.contacts);

  const [messageCount, setMessageCount] = useState([]);
  useEffect(() => {
    const getContacts = async () => {
      try {
        if (userData) {
          const loadingToast = toast.loading("Fetching Data", toastOptions);
          const response = await getContactsRoute(userData._id);
          if (response.data.status === "failed") {
            toast.error("Failed to fetch contacts", toastOptions);
          } else {
            dispatch(userActions.setUserContacts(response.data.contacts));
          }
          let tempMessageCount = [];
          for (const contact of response.data.contacts) {
            const messageResponse = await getMessagesRoute({
              from: userData._id,
              to: contact._id,
            });
            if (messageResponse.data.status === "failed") {
              toast.error("Failed to fetch messages", toastOptions);
            } else {
              tempMessageCount.push(messageResponse.data.messages.length);
            }
          }
          // for (let i = 0; i < response.data.contacts.length; i++) {
          //   const messageResponse = await getMessagesRoute({
          //     from: userData._id,
          //     to: response.data.contacts[i]._id,
          //   });
          //   if (messageResponse.data.status === "failed") {
          //     toast.error("Failed to fetch messages", toastOptions);
          //   } else {
          //     tempMessageCount.push(messageResponse.data.messages.length);
          //   }
          // }
          toast.dismiss(loadingToast);
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
      <div className={classes["chart-1"]}>
        <Doughnut
          data={{
            labels: contacts.map((contact) => contact.username),
            datasets: [
              {
                data: messageCount,
                backgroundColor: [
                  "rgba(255, 99, 132, 0.2)",
                  "rgba(54, 162, 235, 0.2)",
                  "rgba(255, 206, 86, 0.2)",
                  "rgba(75, 192, 192, 0.2)",
                  "rgba(153, 102, 255, 0.2)",
                  "rgba(255, 159, 64, 0.2)",
                ],
                borderColor: [
                  "rgba(255, 99, 132, 1)",
                  "rgba(54, 162, 235, 1)",
                  "rgba(255, 206, 86, 1)",
                  "rgba(75, 192, 192, 1)",
                  "rgba(153, 102, 255, 1)",
                  "rgba(255, 159, 64, 1)",
                ],
                borderWidth: 1,
              },
            ],
          }}
          options={{
            plugins: {
              title: {
                display: true,
                text: "Messages Sent",
                font: {
                  size: 20,
                },
              },
            },
          }}
        />
      </div>
      <div className={classes["chart-2"]}>
        <Bar
          data={{
            labels: contacts.map((contact) => contact.username),
            datasets: [
              {
                label: "Messages",
                data: messageCount,
                xAxisID: "Messages",
                yAxisID: "Contacts",
                backgroundColor: [
                  "rgba(255, 99, 132, 0.2)",
                  "rgba(54, 162, 235, 0.2)",
                  "rgba(255, 206, 86, 0.2)",
                  "rgba(75, 192, 192, 0.2)",
                  "rgba(153, 102, 255, 0.2)",
                  "rgba(255, 159, 64, 0.2)",
                ],
                borderColor: [
                  "rgba(255, 99, 132, 1)",
                  "rgba(54, 162, 235, 1)",
                  "rgba(255, 206, 86, 1)",
                  "rgba(75, 192, 192, 1)",
                  "rgba(153, 102, 255, 1)",
                  "rgba(255, 159, 64, 1)",
                ],
                borderRadius: 10,
                borderWidth: 1,
              },
            ],
          }}
          options={{
            plugins: {
              title: {
                display: true,
                text: "Total count of Messages",
                font: {
                  size: 20,
                },
              },
              legend: {
                display: false,
              },
            },
          }}
        />
      </div>
      <div className={classes["chart-3"]}>
        <Line
          data={{
            labels: contacts.map((contact) => contact.username),
            datasets: [
              {
                label: "Messages sent",
                data: messageCount,
              },
              {
                label: "Messages received",
                data: [
                  messageCount[0] + 5,
                  messageCount[1] + 5,
                  messageCount[2] + 5,
                  messageCount[3] + 5,
                ],
              },
            ],
          }}
          options={{
            plugins: {
              title: {
                display: true,
                text: "Messages Sent and Received",
                font: {
                  size: 20,
                },
              },
            },
          }}
        />
      </div>

      <div className={classes["chart-4"]}>
        <Pie
          data={{
            labels: ["He", "She"],
            datasets: [
              {
                data: [300, 700],
                backgroundColor: [
                  "rgba(255, 99, 132, 0.2)",
                  "rgba(54, 162, 235, 0.2)",
                  "rgba(255, 206, 86, 0.2)",
                  "rgba(75, 192, 192, 0.2)",
                  "rgba(153, 102, 255, 0.2)",
                  "rgba(255, 159, 64, 0.2)",
                ],
                borderColor: [
                  "rgba(255, 99, 132, 1)",
                  "rgba(54, 162, 235, 1)",
                  "rgba(255, 206, 86, 1)",
                  "rgba(75, 192, 192, 1)",
                  "rgba(153, 102, 255, 1)",
                  "rgba(255, 159, 64, 1)",
                ],
                borderWidth: 1,
              },
            ],
          }}
          options={{
            plugins: {
              title: {
                display: true,
                text: "Gender Bias",
                font: {
                  size: 20,
                },
              },
            },
          }}
        />
      </div>
      <div className={classes["chart-5"]}>
        <PolarArea
          data={{
            labels: contacts.map((contact) => contact.username),
            datasets: [
              {
                label: "Messages",
                data: messageCount,
                backgroundColor: [
                  "rgba(255, 99, 132, 0.2)",
                  "rgba(54, 162, 235, 0.2)",
                  "rgba(255, 206, 86, 0.2)",
                  "rgba(75, 192, 192, 0.2)",
                  "rgba(153, 102, 255, 0.2)",
                  "rgba(255, 159, 64, 0.2)",
                ],
                borderColor: [
                  "rgba(255, 99, 132, 1)",
                  "rgba(54, 162, 235, 1)",
                  "rgba(255, 206, 86, 1)",
                  "rgba(75, 192, 192, 1)",
                  "rgba(153, 102, 255, 1)",
                  "rgba(255, 159, 64, 1)",
                ],
                borderWidth: 1,
              },
            ],
          }}
          options={{
            plugins: {
              title: {
                display: true,
                text: "Something else",
                font: {
                  size: 20,
                },
              },
            },
          }}
        />
      </div>
      <div className={classes["chart-6"]}>
        <Radar
          data={{
            labels: contacts.map((contact) => contact.username),
            datasets: [
              {
                label: "Messages",
                data: messageCount,
                backgroundColor: [
                  "rgba(255, 99, 132, 0.2)",
                  "rgba(54, 162, 235, 0.2)",
                  "rgba(255, 206, 86, 0.2)",
                  "rgba(75, 192, 192, 0.2)",
                  "rgba(153, 102, 255, 0.2)",
                  "rgba(255, 159, 64, 0.2)",
                ],
                borderColor: [
                  "rgba(255, 99, 132, 1)",
                  "rgba(54, 162, 235, 1)",
                  "rgba(255, 206, 86, 1)",
                  "rgba(75, 192, 192, 1)",
                  "rgba(153, 102, 255, 1)",
                  "rgba(255, 159, 64, 1)",
                ],
                borderWidth: 1,
              },
            ],
          }}
          options={{
            plugins: {
              title: {
                display: true,
                text: "Inclination towards a contact",
                font: {
                  size: 20,
                },
              },
            },
          }}
        />
      </div>
    </div>
  );
};

export default Stats;
