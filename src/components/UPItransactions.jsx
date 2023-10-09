import { useState, useEffect } from "react";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue } from "firebase/database";

const UPItransactions = () => {
  const [email, setEmail] = useState("");
  const [sms, setSms] = useState([]);
  const [date, setDate] = useState("");

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

  return (
    <>
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
                    <td>{message[0]}</td>
                    <td>{dateCalculator(message)}</td>
                    <td>{message[2]}</td>
                    <td>UPI Transactions</td>
                  </tr>
                )
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default UPItransactions;
