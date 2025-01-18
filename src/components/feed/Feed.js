import React, { useEffect, useState } from 'react';

const Feed = () => {
  const [dogBreeds, setDogBreeds] = useState([]); // To store the fetched dog breeds
  const [loading, setLoading] = useState(true); // To track loading state
  const [error, setError] = useState(null); // To store any potential error

  // Fetch the dog breeds on component mount
  useEffect(() => {
    const fetchDogBreeds = async () => {
      try {
        const response = await fetch('https://frontend-take-home-service.fetch.com/dogs/breeds', {
          method: 'GET', // Explicitly set the HTTP method to GET
          credentials: 'include', // Include cookies (credentials) with the request
        });        
        if (!response.ok) {
          throw new Error('Failed to fetch dog breeds');
        }
        const data = await response.json();
        setDogBreeds(data); // Assuming the response data is an array of breeds
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDogBreeds();
  }, []);

  if (loading) {
    return <p>Loading dog breeds...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div>
      <h2>Available Dog Breeds</h2>
      <ul>
        {dogBreeds.map((breed, index) => (
          <ul key={index}>{breed}</ul>
        ))}
      </ul>
    </div>
  );
};
  
export default Feed;