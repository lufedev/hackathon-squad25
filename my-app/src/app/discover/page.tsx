'use client'
import React, { useEffect, useState } from 'react'
import AvatarUser from '.././assets/img/avatar.svg'
import { User, Project, Session } from '../lib/definiton'
import { getSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import ContainerProjects from '../components/ContainerProjects'
import Header from '../components/Header'
import { ThemeProvider } from 'styled-components'
import { TextField } from '@mui/material'
import { TextFieldTheme } from '../themes/TextField'


export default function Discover( { sessionData }: Session) {
  const [projects, setProjects] = useState<Project[]>([])
  const [tagFilter, setTagFilter] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [country, setCountry] = useState<string>('')
  const [user, setUser] = useState<User>({} as User);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/portfolio/all')

        if (!response.ok) {
          throw new Error('Erro ao obter os dados da API')
        }
        const data = await response.json()
        data.data.map((project: Project) => {
          const date = new Date(project.date)
          const options = {
            timeZone: 'America/Sao_Paulo',
            day: '2-digit',
            month: '2-digit'
          }

          project.date = date.toLocaleDateString('en-US', options)
        })
        setProjects(data.data)
      } catch (error) {
        console.error('Erro ao obter dados:', error.message)
      }
    }

    fetchData()
  }, [])

  useEffect(() => {
    fetch('https://get.geojs.io/v1/ip/geo.json')
      .then((response) => response.json())
      .then((data) => {
        setCountry(data.country)
      })
      .catch((error) => console.error('Erro ao obter o nome do país:', error))
  }, [])
  const filterProjectsByTag = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTagFilter(event.target.value)
  }

  useEffect(() => {
    const userFromLocalStorage = localStorage.getItem('user');
    if (userFromLocalStorage) {
      setUser(JSON.parse(userFromLocalStorage));
    }
  }, []);

   

  return (
    <div>
       <Header user={user} />
      <div className="flex flex-col items-center justify-start mt-14 mx-6 gap-10">
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
              value={tagFilter}
              onChange={filterProjectsByTag}
            />
          </ThemeProvider>
          {projects.map((project: Project) => {
            const users: User = {
              name: project?.usuario as string,
              email: 'default',
              projects: [project],
              image: AvatarUser,
              sname: '',
              password: '',
              country: ''
            }

            return (
              <ContainerProjects
                editable={false}
                user={users}
                filter={tagFilter}
              />
            )
          })}
        </div>
      </div>
    </div>
  )
}
