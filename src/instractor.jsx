import React from 'react';

const InstructorPage = () => {
    return (
        <div>
            <head>
                <meta charSet="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <title>Instructor - Add Module</title>
            </head>
            <body>
                <div className="header">
                    <h1>Instructor Dashboard</h1>
                </div>
                <div className="container">
                    <h2>Add New Module</h2>
                    <form action="uploadmodule" method="POST" encType="multipart/form-data">
                        <label htmlFor="title">Module Title:</label>
                        <input type="text" name="title" required /><br /><br />

                        <label htmlFor="pdf">Upload PDF:</label>
                        <input type="file" name="pdf" accept="application/pdf" required /><br /><br />

                        <button type="submit">Upload Module</button>
                    </form>
                </div>
            </body>
        </div>
    );
};

export default InstructorPage;
