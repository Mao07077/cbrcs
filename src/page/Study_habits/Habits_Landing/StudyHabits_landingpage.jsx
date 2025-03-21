import React from "react";
import "./studyhabits.css";
import Header from "../../../Components/Header";
import Icon from "../../../icon/actual.png"; // Adjust path as needed

const studyHabits = ["Study with Friends", "Time Management", "Asking For Help"];

const top10StudyHabits = [
  "Study with Friends",
  "Asking for Help",
  "Test Yourself Periodically",
  "Create a Study Schedule",
  "Time Management",
  "Set Study Goals",
  "Organizing Notes",
  "Use of Technology",
  "Use Flashcards",
  "Review Schoolwork on Weekends",
];

const StudyHabits = () => {
  return (
    <>
      <div className="container">
        <Header />
        <h2 className="title">Study Habits</h2>

        <div className="section">
          <h3 className="subtitle">Your Top 3 Study Habits:</h3>
          <div className="top-habits">
            {studyHabits.map((habit, index) => (
              <div key={index} className="habit-card">
                <p className="habit-title">{habit}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="section">
          <h3 className="subtitle">Top 10 Study Habits</h3>
          <div className="grid-container">
            {top10StudyHabits.map((habit, index) => (
              <div key={index} className="habit-card">
                <p className="habit-title">{index + 1}. {habit}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer is now outside of the container */}
      <div className="footer">
        <img src={Icon} alt="CBRC Logo" />
        <p>&copy; 2024 Dr. Carl Balita Review Center. All Rights Reserved.</p>
      </div>
    </>
  );
};

export default StudyHabits;
