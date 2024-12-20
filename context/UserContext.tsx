import { createContext, useContext, useState, ReactNode } from 'react';

interface User {
  name: string;
  email: string;
  priceList: string; // Add priceList to the User interface
}

interface UserContextProps {
  user: User;
  setUser: (user: User) => void; // Add setUser to the context
  logout: () => void;
}

const UserContext = createContext<UserContextProps | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User>({ name: 'John Doe', email: 'john.doe@example.com', priceList: '' });

  const logout = () => {
    setUser({ name: '', email: '', priceList: '' });
    // Add any additional logout logic here
  };

  return (
    <UserContext.Provider value={{ user, setUser, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
