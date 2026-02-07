import { Dashboard } from "./components/Dashboard";
import { Header } from "./components/Header";
import { GlobalStyle } from "./styles/global";
import { useState } from "react";
import {UsersProvider } from "./hooks/useUsers";
import { NewUserModal } from "./components/NewUserModal";

export function App() {

  const [isNewUserModalOpen, setIsNewUserModalOpen] = useState(false)

  function handleOpenNewUserModal(){
    setIsNewUserModalOpen(true)
  }

  function handleCloseNewUserModal(){
    setIsNewUserModalOpen(false)
  }

  return (
    <UsersProvider>
      <Header />

      <Dashboard onOpenNewUserModal={handleOpenNewUserModal}/>

      <NewUserModal
        isOpen={isNewUserModalOpen}
        onRequestClose={handleCloseNewUserModal}
      />

      <GlobalStyle />
    </UsersProvider>
  );
}