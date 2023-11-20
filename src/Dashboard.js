import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import Chart from "chart.js/auto";

const Container = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #030303;
`;

const Heading = styled.h1`
  font-size: 32px;
  font-family: "Poppins";
  color: #ffffff;
  margin-bottom: 20px;
  text-align: center;
`;

const Paragraph = styled.p`
  font-size: 16px;
  font-family: "Poppins";
  color: #ffffff;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  justify-content: flex-start; /* Align text to the left */
`;

const Input = styled.input`
  font-size: 16px;
  font-family: "Poppins";
  border: 1px solid #ffffff;
  padding: 10px;
  margin-bottom: 10px;
  width: 300px;
  color: #ffffff;
  text-align: center;
  margin-left: 10px;
  border-radius: 10px;
  background-color: #030303;
`;

const SaveButton = styled.button`
  background-color: #6741d9;
  color: #ffffff;
  width: 100%;
  max-width: 600px;
  border: 1px solid #f0c3f1;
  border-radius: 10px;
  cursor: pointer;
  font-size: 16px;
  font-family: "Poppins";
  padding: 10px 20px;
`;

const LogoutButton = styled.button`
  background-color: #6741d9;
  color: #ffffff;
  border: 1px solid #f0c3f1;
  cursor: pointer;
  font-size: 16px;
  width: 100%;
  max-width: 600px;
  border-radius: 10px;
  font-family: "Poppins";
  padding: 10px 20px;
  margin-top: 20px;
`;

const RadioButtonContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
`;

const RadioLabel = styled.label`
  font-size: 16px;
  font-family: "Poppins";
  color: #ffffff;
  margin-right: 10px;
`;

const RadioInput = styled.input`
  margin-right: 5px;
  width: 20px;
  height: 20px;
  appearance: none;
  background-color: #030303;
  border: 4px solid #ffffff;
  border-radius: 50%;
  outline: none;

  &:checked {
    background-color: #ffffff;
    content: "";
    display: block;
    margin: 3px;
    background-color: #6741d9;
    border-radius: 50%;
  }

  &:before {
    content: "";
    display: block;
    width: 12px;
    height: 12px;
  }
`;

const RegularAmountButtonContainer = styled.div`
  margin-left: auto;
  align-items: center;
`;

const RegularAmountButton = styled.button`
  background-color: ${(props) => (props.selected ? "#030303" : "#000000")};
  color: ${(props) => (props.selected ? "#ffffff" : "#000000")};
  border: 1px solid #f0c3f1;
  cursor: pointer;
  font-size: 16px;
  font-family: "Poppins";
  padding: 10px 20px;
  margin-right: 10px;
  border-radius: 10px;

  &:focus {
    outline: none;
    background-color: #6741d9;
  }
`;

const GraphContainer = styled.canvas`
  margin-top: 20px;
  max-width: 600px;
  width: 100%;
`;

const Dashboard = ({ onLogout }) => {
  const navigate = useNavigate();
  const [data, setData] = useState({});
  const [customAmount, setCustomAmount] = useState(0);
  const [regularAmounts, setRegularAmounts] = useState({
    category_7: 0,
    category_8: 0,
    category_9: 0,
    category_10: 0,
  });
  const [isCharging, setIsCharging] = useState(false);
  const [saveButtonEnabled, setSaveButtonEnabled] = useState(false);
  const [chargeCustomer, setChargeCustomer] = useState(false);

  // Create a ref to store the Chart instance
  const chartRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const adminId = localStorage.getItem("adminId");

        const response = await axios.get(
          `https://stg.dhunjam.in/account/admin/${adminId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 200) {
          setData(response.data.data);
          setCustomAmount(response.data.data.amount.category_6);
          setRegularAmounts({
            category_7: response.data.data.amount.category_7,
            category_8: response.data.data.amount.category_8,
            category_9: response.data.data.amount.category_9,
            category_10: response.data.data.amount.category_10,
          });
          setIsCharging(response.data.data.charge_customers);

          setSaveButtonEnabled(
            response.data.data.charge_customers &&
              customAmount > 99 &&
              regularAmounts.category_7 > 79 &&
              regularAmounts.category_8 > 59 &&
              regularAmounts.category_9 > 39 &&
              regularAmounts.category_10 > 19
          );

          // Create a bar chart
          const ctx = document.getElementById("barChart");
          chartRef.current = new Chart(ctx, {
            type: "bar",
            data: {
              labels: Object.keys(regularAmounts),
              datasets: [
                {
                  label: "Regular Song Request Amount",
                  backgroundColor: "#f0c3f1",
                  data: Object.values(regularAmounts),
                },
              ],
            },
            options: {
              layout: {
                padding: 5,
                autoPadding: true,
              },
              scales: {
                y: {
                  beginAtZero: true,
                  title: {
                    display: true,
                    text: "Amount",
                    color: "#ffffff",
                  },
                },
                x: {
                  title: {
                    display: true,
                    text: "Category",
                    color: "#ffffff",
                  },
                },
              },
              responsive: false,
              maintainAspectRatio: false,
              indexAxis: "x", // Set to 'x' to have vertical bars
              barPercentage: 0.6, // Adjust the gap between bars
              categoryPercentage: 0.9, // Adjust the width of the bars
              
            },
          });
        } else {
          // Handle other status codes if needed
        }
      } catch (error) {
        // Handle network errors or other issues
        console.error("Error fetching data:", error.message);
      }
    };

    fetchData();
  }, []); // Run only once on component mount

  // Function to update the chart when data changes
  const updateChart = () => {
    chartRef.current.data.datasets[0].data = Object.values(regularAmounts);
    chartRef.current.update();
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("adminId");
    onLogout();
    // Navigate to Login using useNavigate
    navigate("/");
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");
      const adminId = localStorage.getItem("adminId");

      const response = await axios.put(
        `https://stg.dhunjam.in/account/admin/${adminId}`,
        {
          amount: {
            category_6: customAmount,
            category_7: regularAmounts.category_7,
            category_8: regularAmounts.category_8,
            category_9: regularAmounts.category_9,
            category_10: regularAmounts.category_10,
          },
          charge_customers: chargeCustomer,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        setData(response.data.data);
        setSaveButtonEnabled(false);
        // Update the chart after saving
        updateChart();
      } else {
        // Handle other status codes if needed
      }
    } catch (error) {
      console.error("Error updating prices:", error.message);
    }
  };

  const handleCustomAmountChange = (value) => {
    setCustomAmount(value);
    setSaveButtonEnabled(isCharging && value > 99);
  };

  const handleRegularAmountChange = (category, value) => {
    setRegularAmounts((prevAmounts) => ({
      ...prevAmounts,
      [category]: value,
    }));

    setSaveButtonEnabled(
      isCharging &&
        value > 99 &&
        regularAmounts.category_7 > 79 &&
        regularAmounts.category_8 > 59 &&
        regularAmounts.category_9 > 39 &&
        regularAmounts.category_10 > 19
    );

    console.log(`Selected value for ${category}: ${value}`);
  };

  const handleChargeCustomerChange = (e) => {
    setChargeCustomer(e.target.value === "yes");
  };

  return (
    <Container>
      <div>
        <Heading>
          {data.name}, {data.location} on Dhun jam
        </Heading>

        <RadioButtonContainer>
          <RadioLabel>
            Do you want to charge your <br></br>
            customer for requesting a song?
          </RadioLabel>
          <RadioInput
            type="radio"
            name="chargeCustomer"
            value="yes"
            checked={chargeCustomer}
            onChange={handleChargeCustomerChange}
          />
          <RadioLabel>Yes</RadioLabel>
          <RadioInput
            type="radio"
            name="chargeCustomer"
            value="no"
            checked={!chargeCustomer}
            onChange={handleChargeCustomerChange}
          />
          <RadioLabel>No</RadioLabel>
        </RadioButtonContainer>

        {chargeCustomer && (
          <div>
            <Paragraph>
              Custom Song Request Amount:{" "}
              <Input
                type="number"
                placeholder="Enter amount"
                value={customAmount}
                onChange={(e) => handleCustomAmountChange(e.target.value)}
              />
            </Paragraph>
            <Paragraph>
              Regular Song Request Amount:
              <RegularAmountButtonContainer>
                <RegularAmountButton
                  selected={true}
                  onClick={() =>
                    handleRegularAmountChange(
                      "category_7",
                      regularAmounts.category_7
                    )
                  }
                >
                  {regularAmounts.category_7}
                </RegularAmountButton>
                <RegularAmountButton
                  selected={true}
                  onClick={() =>
                    handleRegularAmountChange(
                      "category_8",
                      regularAmounts.category_8
                    )
                  }
                >
                  {regularAmounts.category_8}
                </RegularAmountButton>
                <RegularAmountButton
                  selected={true}
                  onClick={() =>
                    handleRegularAmountChange(
                      "category_9",
                      regularAmounts.category_9
                    )
                  }
                >
                  {regularAmounts.category_9}
                </RegularAmountButton>
                <RegularAmountButton
                  selected={true}
                  onClick={() =>
                    handleRegularAmountChange(
                      "category_10",
                      regularAmounts.category_10
                    )
                  }
                >
                  {regularAmounts.category_10}
                </RegularAmountButton>
              </RegularAmountButtonContainer>
            </Paragraph>
          </div>
        )}
        <GraphContainer id="barChart"></GraphContainer>
        <SaveButton onClick={handleSave} disabled={!saveButtonEnabled}>
          Save
        </SaveButton>
        <LogoutButton onClick={handleLogout}>Logout</LogoutButton>
      </div>
    </Container>
  );
};

export default Dashboard;
