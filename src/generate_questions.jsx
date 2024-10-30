import React, { useState } from 'react';

const GenerateQuestions = () => {
    const [inputText, setInputText] = useState("The Eiffel Tower is located in Paris.");
    const [output, setOutput] = useState([]);
    const [error, setError] = useState(null);

    const handleGenerateQuestions = async () => {
        try {
            const response = await fetch('/path-to-your-api-endpoint', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ inputText }),
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`);
            }

            const data = await response.json();
            setOutput(data.output);
            setError(null);
        } catch (err) {
            setError(err.message);
            setOutput([]);
        }
    };

    return (
        <div>
            <h1>Generate Questions</h1>
            <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                rows="4"
                cols="50"
            />
            <br />
            <button onClick={handleGenerateQuestions}>Generate Questions</button>
            <div>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                {output.map((line, index) => (
                    <p key={index}>{line}</p>
                ))}
            </div>
        </div>
    );
};

export default GenerateQuestions;
