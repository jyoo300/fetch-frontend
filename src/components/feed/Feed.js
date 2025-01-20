import React, { useEffect, useState } from 'react';
import { AgGridReact } from 'ag-grid-react'; // Import AG Grid React
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community'; 

ModuleRegistry.registerModules([AllCommunityModule]);

const Feed = () => {
  const [breedIds, setBreedIds] = useState([]); // To store the fetched dog breeds
  const [dogBreeds, setDogBreeds] = useState([]); // To store the fetched dog breeds
  const [favorites, setFavorites] = useState([]); // To store favorite dog IDs
  const [match, setMatch] = useState(null); // To store the generated match
  const [matchId, setMatchId] = useState('');// To store the match id
  const [loading, setLoading] = useState(true); // To track loading state
  const [error, setError] = useState(null); // To store any  potentialerror

  // Fetch the dog breeds on component mount
  useEffect(() => {
    const fetchDogBreedIds = async () => {
      try {
        const response = await fetch('https://frontend-take-home-service.fetch.com/dogs/search?size=100', {
          method: 'GET', // Explicitly set the HTTP method to GET
          credentials: 'include', // Include cookies (credentials) with the request
        });        
        if (!response.ok) {
          throw new Error('Failed to fetch dog breed ids');
        }
        const data = await response.json();
         // Map the fetched data to the desired format
        setBreedIds(data.resultIds); // Update state with the formatted data
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDogBreedIds();
  }, []);

  useEffect(() => {
    const fetchDogBreeds = async () => {
      try {
        const response = await fetch('https://frontend-take-home-service.fetch.com/dogs', {
          method: 'POST', // Explicitly set the HTTP method to POST
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(breedIds),
          credentials: 'include', // Include cookies (credentials) with the request
        });        
        if (!response.ok) {
          throw new Error('Failed to fetch dog breeds');
        }
        const data = await response.json();
        setDogBreeds(data);
         // Map the fetched data to the desired format
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if(breedIds.length > 0) {
      fetchDogBreeds();
    }
  }, [breedIds]);

  // useEffect for the match info
  useEffect(() => {
    const fetchMatchBreed = async () => {
      const selectedMatch = favorites.find((dog) => dog.id === matchId); // Find the dog in favorites by matchId
      if (selectedMatch) {
        setMatch(selectedMatch); // Set the selected dog as the match
      }
    };

    if(matchId.length > 0) {
      fetchMatchBreed();
    }
  }, [matchId]);

  // Add dog to favorites table
  const addToFavorites = (dog) => {
    if (!favorites.some((fav) => fav.id === dog.id)) {
      setFavorites((prevFavorites) => [...prevFavorites, dog]);
    }
  };

  // Remove dog from favorites
  const removeFromFavorites = (dogId) => {
    setFavorites((prevFavorites) =>
      prevFavorites.filter((fav) => fav.id !== dogId)
    );
  };

    // Generate a match using the favorited dog IDs
  const generateMatch = async () => {
    try {
      const favoriteIds = favorites.map((dog) => dog.id); // Get IDs of favorites
      const response = await fetch(
        'https://frontend-take-home-service.fetch.com/dogs/match',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(favoriteIds),
          credentials: 'include',
        }
      );

      if (!response.ok) {
        throw new Error('Failed to generate a match');
      }

      const data = await response.json();
      setMatchId(data.match); // Update state with the generated match
    } catch (error) {
      setError(error.message);
    }
  };

  // Column definitions for AG Grid
  const columnDefs = [
    { headerName: 'Name', field: 'name', sortable: true, filter: true },
    { headerName: 'Breed', field: 'breed', sortable: true, filter: true },
    { headerName: 'Zip Code', field: 'zip_code', sortable: true, filter: true },
    { headerName: 'Age', field: 'age', sortable: true, filter: true },

    {
      headerName: 'Add to Favorites',
      field: 'add',
      cellRenderer: (params) => (
        <button onClick={() => addToFavorites(params.data)}>Add</button>
      ),
    },
  ];

    // Column definitions for the favorites table
    const favoritesColumnDefs = [
      { headerName: 'Name', field: 'name', sortable: true, filter: true },
      { headerName: 'Breed', field: 'breed', sortable: true, filter: true },
      { headerName: 'Zip Code', field: 'zip_code', sortable: true, filter: true },
      { headerName: 'Age', field: 'age', sortable: true, filter: true },
      {
        headerName: 'Remove',
        field: 'remove',
        cellRenderer: (params) => (
          <button onClick={() => removeFromFavorites(params.data.id)}>
            Remove
          </button>
        ),
      },
    ];

  const defaultColDef = {
    flex: 1,
    minWidth: 150, // Minimum column width
    resizable: true, // Allow resizing
  };

  if (loading) {
    return <p>Loading dog breeds...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div>
      <div style={{ height: 1000, width: 1000, margin: '0 auto' }}>
        <h2>Dog Breeds</h2>
        <AgGridReact
          rowData={dogBreeds}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          pagination={true}
          paginationPageSize={20}
        />
      </div>

      <div style={{ height: 1000, width: 1000, margin: '0 auto', marginTop: '20px' }}>
        <h3>Favorites Table:</h3>
        <AgGridReact
          rowData={favorites}
          columnDefs={favoritesColumnDefs}
          defaultColDef={defaultColDef}
          pagination={true}
          paginationPageSize={10}
        />
        <button
          onClick={generateMatch}
          disabled={favorites.length === 0}
          style={{
            marginTop: '10px',
            padding: '10px',
            fontSize: '16px',
            cursor: 'pointer',
          }}
        >
          Generate Match
        </button>
      </div>

      {match && (
        <div style={{ paddingTop: '100px' }}>
          <h3>Match Found!</h3>
          <p><strong>Name:</strong> {match.name}</p>
          <p><strong>Breed:</strong> {match.breed}</p>
          <p><strong>Age:</strong> {match.age}</p>
          <p><strong>Zip Code:</strong> {match.zip_code}</p>
        </div>
      )}
    </div>
  );
};
  
export default Feed;