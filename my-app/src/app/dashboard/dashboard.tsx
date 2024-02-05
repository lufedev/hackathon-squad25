"use client";
import React, { useEffect, useState } from 'react';
import CardProfile from '../components/CardProfile';
import Header from '../components/Header';
import AvatarUser from '.././assets/img/avatar.svg';
import { User, Session, Project } from '../lib/definiton';
import { TextFieldTheme } from '../themes/TextField';
import { ThemeProvider } from '@mui/material/styles';
import { TextField } from '@mui/material';
import ModalAddProject from '../components/ModalAddProject';
import ContainerProjects from '../components/ContainerProjects';
import ButtonFirstProject from '../components/ButtonAddFirstProject';

export default function Home({ sessionData }: Session) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [searchTag, setSearchTag] = useState('');
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/portfolio');

        if (!response.ok) {
          throw new Error('Erro ao obter os dados da API');
        }
        const data = await response.json();
        setProjects(data.data);
      } catch (error) {
        console.error('Erro ao obter dados:', error.message);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    // Filtrar os projetos com base na tag pesquisada
    const filtered = projects.filter(project =>
      project.tags.includes(searchTag)
    );
    setFilteredProjects(filtered);
  }, [projects, searchTag]);

  const [modalOpen, setModalOpen] = useState(false);
  

  const openModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTag(event.target.value);
    user.projects = filteredProjects
  };

  const user: User = {
    name: sessionData.name,
    email: sessionData.email,
    projects: projects,
    image: AvatarUser,
    sname: '',
    password: '',
    country: ''
  };

  const isProject: boolean = user.projects.length > 0;

  return (
    <div>
      <Header user={user} />
      <div className="flex flex-col items-center justify-start mt-14 mx-6 gap-10">
        <CardProfile user={user} onClick={openModal} />
        <ModalAddProject user={user} states={modalOpen} onClose={closeModal} />
        <div className="w-full mb-6">
          <h4 className="h6 text-color-neutral-130 mb-4">Meus projetos</h4>
          <ThemeProvider theme={TextFieldTheme}>
          <TextField
              name="Buscar tags"
              label="Buscar tags"
              variant="outlined"
              size="medium"
              className="w-full md:w-[32rem]"
              type="text"
              value={searchTag}
              onChange={handleSearchChange}
            />
          </ThemeProvider>
          {isProject ? (
            <ContainerProjects user={user}/>
          ) : (
            <ButtonFirstProject onClick={openModal} />
          )}
        </div>
      </div>
    </div>
  );
}
