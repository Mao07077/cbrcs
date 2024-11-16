import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const PostTest = () => {
  const { moduleId } = useParams(); // Get the module ID from the URL

  const [postTest, setPostTest] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPostTestData = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/post-test/${moduleId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch post-test data');
        }
        const data = await response.json();
        setPostTest(data);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchPostTestData();
  }, [moduleId]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!postTest) {
    return <div>Loading post-test...</div>;
  }

  return (
    <div>
      <h1>Post-test for Module {moduleId}</h1>
      <p>{postTest.description}</p>
      {/* Add your test questions and options here */}
    </div>
  );
};

export default PostTest;
