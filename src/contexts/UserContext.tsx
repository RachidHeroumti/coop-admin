import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User } from '../types';
import { v4 as uuidv4 } from 'uuid';

interface UserContextType {
  users: User[];
  addUser: (user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>) => boolean;
  updateUser: (id: string, user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>) => boolean;
  deleteUser: (id: string) => void;
  getUser: (id: string) => User | undefined;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

// Mock data
const initialUsers: User[] = [
  {
    id: '1',
    name: 'أحمد محمد',
    email: 'ahmed.mohammed@example.com',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: '2',
    name: 'فاطمة علي',
    email: 'fatima.ali@example.com',
    createdAt: new Date('2024-01-02'),
    updatedAt: new Date('2024-01-02')
  }
];

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [users, setUsers] = useState<User[]>(initialUsers);

  const addUser = (userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): boolean => {
    // Check for email uniqueness
    if (users.some(user => user.email === userData.email)) {
      return false;
    }

    const newUser: User = {
      ...userData,
      id: uuidv4(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    setUsers(prev => [...prev, newUser]);
    return true;
  };

  const updateUser = (id: string, userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): boolean => {
    // Check for email uniqueness (excluding current user)
    if (users.some(user => user.email === userData.email && user.id !== id)) {
      return false;
    }

    setUsers(prev => prev.map(user => 
      user.id === id 
        ? { ...userData, id, createdAt: user.createdAt, updatedAt: new Date() }
        : user
    ));
    return true;
  };

  const deleteUser = (id: string) => {
    setUsers(prev => prev.filter(user => user.id !== id));
  };

  const getUser = (id: string) => {
    return users.find(user => user.id === id);
  };

  const value = {
    users,
    addUser,
    updateUser,
    deleteUser,
    getUser
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};