import React, { useContext, useEffect, useState } from "react";
import groupContext from "../../context/groups/groupContext";
import { ScissorsIcon, UserGroupIcon } from "@heroicons/react/24/solid";
import { fetchData } from "../helper.js";

const GroupDetails = ({ group }) => {
  const context = useContext(groupContext);
  const { members, getMembers, addMembers } = context;

  useEffect(() => {
    const fetchUserData = async () => {
      if (localStorage.getItem("user_details")) {
        await getMembers();
      }
    };

    fetchUserData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [members]);

  const [addMemberEmail, setAddMemberEmail] = useState("");
  const [splitAmounts, setSplitAmounts] = useState([]); // Store split amounts here

  const calculateAverage = () => {
    const totalAmount = members.reduce(
      (acc, member) => parseFloat(acc) + (splitAmounts[member.user_id] || 0),
      0
    );
    return parseFloat(totalAmount) / members.length;
  };

  const handleSplit = async () => {
    const average = calculateAverage();
    let updatedBalances = {};

    members.forEach((member) => {
      const splitAmount = splitAmounts[member.user_id] || 0;
      const balanceDifference = parseFloat(splitAmount) - parseFloat(average);
      updatedBalances[member.user_id] = parseFloat(balanceDifference);
    });

    // Update user balances in the database
    const user_details = await fetchData("user_details");
    const user_id = await user_details.id;
    const requestBody = { user_id, updatedBalances };
    const host = "http://localhost:5000";
    try {
      const response = await fetch(`${host}/api/groups/split`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (response.status === 200) {
        // Split completed successfully, you can update the UI or perform any additional actions here
        const data = await response.json();
        const newBalance = await data.newBalance;

        user_details.balance = parseFloat(newBalance);
        localStorage.setItem("user_details", JSON.stringify(user_details));

        window.alert("Splitting done!");
      } else {
        // Handle errors from the server
        const errorMessage = await response.text();
        console.error(errorMessage);
      }
    } catch (error) {
      console.error("Error:", error);
    }

    // Clear splitAmounts and reload members
    setSplitAmounts({});
    await getMembers();
  };

  return (
    <div
      style={{
        border: "2px dashed black",
        padding: "15px",
        borderRadius: "20px",
      }}
    >
      <h3 style={{ margin: "10px 0 20px 0" }}>{group.group_name} Members</h3>
      {members && (
        <div>
          {members.map((member) => (
            <div
              key={member.user_id}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                margin: "10px 10px",
              }}
            >
              <span style={{ fontSize: "20px", fontWeight: "500" }}>
                {member.user_name}
              </span>
              <input
                type="number"
                name={`${member.user_id}splitAmount`}
                id={`${member.user_id}splitAmount`}
                style={{ width: "250px" }}
                value={splitAmounts[member.user_id] || ""}
                placeholder="Amount."
                onChange={(e) => {
                  setSplitAmounts({
                    ...splitAmounts,
                    [member.user_id]: parseFloat(e.target.value),
                  });
                }}
              />
            </div>
          ))}
          <div>
            <button
              type="submit"
              className="btn btn--two"
              style={{
                margin: "20px 10px",
                height: "45px",
                fontWeight: "bold",
              }}
              onClick={handleSplit}
            >
              <ScissorsIcon width={20} />
              <span>Split</span>
            </button>
            <h5 style={{ marginTop: "40px" }}>Add members below.</h5>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <input
                type="text"
                name="addMember"
                value={addMemberEmail}
                onChange={(e) => {
                  setAddMemberEmail(e.target.value);
                }}
                id="addMember"
                style={{ width: "300px" }}
                placeholder="Email here."
              />
              <button
                className="btn btn--eight"
                style={{
                  margin: "20px 10px",
                  height: "45px",
                  fontWeight: "bold",
                }}
                onClick={async () => {
                  await addMembers(
                    group.group_id,
                    addMemberEmail,
                    group.group_name
                  );
                  setAddMemberEmail("");
                }}
              >
                <UserGroupIcon width={20} />
                <span>Add members</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GroupDetails;
