import { createContext, useState, useEffect } from 'react';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
   
    const fetchCurrentUser = async () => {
      try {
       
        const token = localStorage.getItem('token');

       
        const response = await fetch('http://localhost:8080/users/current-user', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`, 
          },
        });

        if (response.ok) {
          const user = await response.json();
          setCurrentUser(user);
        } else {
          setCurrentUser(null);
        }
      } catch (error) {
        console.error('Error fetching current user:', error);
        setCurrentUser(null);
      }
    };

    
    fetchCurrentUser();
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
