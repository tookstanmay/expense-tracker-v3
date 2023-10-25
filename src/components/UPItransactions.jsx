import { useState, useEffect } from "react";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue } from "firebase/database";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
ChartJS.register(ArcElement, Tooltip, Legend);

const UPItransactions = () => {
  const [email, setEmail] = useState("");
  const [sms, setSms] = useState([]);
  const [date, setDate] = useState("");
  const [credited, setCredited] = useState(null);
  const [debited, setDebited] = useState(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const firebaseConfig = {
      apiKey: "AIzaSyAbcVm8dGEMjTMn2DjIT_S-FVRKgPIivSg",
      authDomain: "smstestfinal.firebaseapp.com",
      databaseURL: "https://smstestfinal-default-rtdb.firebaseio.com/",
      projectId: "smstestfinal",
      storageBucket: "smstestfinal.appspot.com",
      messagingSenderId: "348546987224",
      appId: "1:348546987224:android:981528fdf53619558213ad",
    };
    const fetchUserData = async () => {
      const userDetails = await JSON.parse(
        localStorage.getItem("user_details")
      );
      const userEmail = userDetails?.email;
      setEmail(userEmail?.split("@")[0]);
    };

    if (email !== "") {
      const firebaseSetup = () => {
        // Initialize Firebase
        const firebaseApp = initializeApp(firebaseConfig);
        const database = getDatabase(firebaseApp);
        const databaseRef = ref(database, email);

        // Listen for changes in Firebase data and update the state
        onValue(databaseRef, (snapshot) => {
          const smsData = [];
          snapshot.forEach((childSnapshot) => {
            smsData.push(childSnapshot.val());
          });
          setSms(smsData);
        });
      };
      firebaseSetup();
    }

    fetchUserData();
  }, [email]);

  useEffect(() => {
    calculateTotals();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sms]);

  const dateCalculator = (message) => {
    const epochT = parseInt(message[1]);
    const normalDate = new Date(epochT);
    const year = normalDate.getFullYear();
    const month = normalDate.getMonth() + 1;
    const day = normalDate.getDate();
    const formattedDate = `${year}-${month.toString().padStart(2, "0")}-${day
      .toString()
      .padStart(2, "0")}`;
    return formattedDate;
  };

  const calculateTotals = () => {
    let creditedTotal = 0;
    let debitedTotal = 0;

    sms.forEach((message) => {
      if (message[2] === "Credited" || message[2] === "Debited") {
        if (message[2] === "Credited") {
          creditedTotal += message[0] / 80;
        } else {
          debitedTotal += message[0] / 80;
        }
      }
    });

    setCredited(creditedTotal.toFixed(2));
    setDebited(debitedTotal.toFixed(2));
  };

  // Pie Chart for credit and debit
  const options = {
    plugins: {
      legend: {
        labels: {
          font: {
            size: 16, // You can adjust the font size here
          },
        },
      },
    },
  };
  const pieNames = ["Credit", "Debit"];
  const pieData = [credited, debited];
  const pieColor = ["#F99417", "#4D4C7D"];
  const data = {
    labels: pieNames,
    datasets: [
      {
        data: pieData,
        backgroundColor: pieColor,
      },
    ],
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-around",
        width: "100%",
      }}
    >
      <div className="table">
        <table>
          <thead>
            <tr>
              <th>Amount</th>
              <th>Date</th>
              <th>Credited/Debited</th>
              <th>Category</th>
            </tr>
          </thead>
          <tbody>
            {sms.map(
              (message, index) =>
                message[0] && (
                  <tr key={index}>
                    <td>{message[0] / 80}</td>
                    <td>{dateCalculator(message)}</td>
                    <td>{message[2]}</td>
                    <td>UPI Transactions</td>
                  </tr>
                )
            )}
          </tbody>
        </table>
      </div>
      {credited && debited && (
        <div style={{ marginTop: "40px" }}>
          <div>
            <div style={{ fontSize: "20px" }}>
              <span>
                <b>Credited: </b>
              </span>
              <span>{credited}</span>
            </div>
            <div style={{ fontSize: "20px" }}>
              <span>
                <b>Debited: </b>
              </span>
              <span>{debited}</span>
            </div>
          </div>
          <div style={{ marginTop: "20px" }}>
            <Doughnut data={data} options={options}></Doughnut>
          </div>
        </div>
      )}
    </div>
  );
};

export default UPItransactions;
