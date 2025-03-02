import React from "react";
import "./studyhabits.css";

const studyHabits = [
  "Study with Friends",
  "Time Management",
  "Asking For Help",
];

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
    <div className="container">
      <h2 className="title">Study Habits</h2>
      <div className="section">
        <h3 className="subtitle">Your Top 3 Study Habits:</h3>
        <div className="top-habits">
          {studyHabits.map((habit, index) => (
            <div key={index} className="habit-card">
              <p className="habit-title">{habit}</p>
              <p className="habit-description">Description Here</p>
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
              <p className="habit-description">Description Here</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StudyHabits;
