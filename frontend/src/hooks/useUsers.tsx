import axios from 'axios'
import {createContext, useState, useEffect, ReactNode, useContext} from 'react'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const MySwal = withReactContent(Swal);

import {api} from '../services/api'

interface User {
    id_user: number,
    name: string,
    email: string,
    telephone: string,
    birth_date: string,
    birth_city: string,
    companies: string
}

interface UserInput {
    name: string,
    email: string,
    telephone: string,
    birth_date: string,
    birth_city: string,
    companies: number[]
}

//type UserInput = Omit<User, 'id_users' | 'companies'>

interface UsersProviderProps{
    children: ReactNode
}

interface UsersContextData{
    users: User[],
    createUser: (user: UserInput) => Promise<boolean>,
    deleteUser: (userId: number) => Promise<void>
}

export const UsersContext = createContext<UsersContextData>(
    {} as UsersContextData
)

export function UsersProvider({children} : UsersProviderProps){

    const [users, setUsers] = useState<User[]>([])

    useEffect(() =>{
        
        // mock api
        // api.get('users')
        //     .then(response => setUsers(response.data.users))

        api.get('user')
            .then(response => setUsers(response.data))
            .catch(error => {
                console.error('Erro ao carregar usuários:', error);
                // Em caso de erro, mantém lista vazia ao invés de quebrar
                // Opcional: poderia exibir mensagem de erro ao usuário
            })


    }, [])

    async function createUser(userInput : UserInput): Promise<boolean>{

        if(Array.isArray(userInput.companies) && userInput.companies[0] !== 0){
            
            try {
                const response = await api.post('/user/create', userInput);
                const user = response.data;

                setUsers([
                    ...users,
                    user
                ])
                
                return true;
            } catch (error: any) {
                let errorMessage = 'Erro ao cadastrar usuário!';
                
                // Tratamento específico de tipos de erro
                if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
                    errorMessage = 'Tempo de espera esgotado. Tente novamente.';
                } else if (error.code === 'ERR_NETWORK' || !error.response) {
                    errorMessage = 'Sem conexão com o servidor. Verifique sua internet.';
                } else if (error.response?.status === 400) {
                    errorMessage = error.response?.data?.error || 'Dados inválidos. Verifique os campos preenchidos.';
                } else if (error.response?.status === 500) {
                    errorMessage = 'Erro no servidor. Tente novamente mais tarde.';
                }
                
                await MySwal.fire({
                    title: <strong>Erro!</strong>,
                    html: <i>{errorMessage}</i>,
                    icon: 'error',
                    allowOutsideClick: false,
                    allowEscapeKey: false
                })
                return false;
            }

        }else{

            await MySwal.fire({
                title: <strong>Atenção!</strong>,
                html: <i>Insira as empresas do usuário!</i>,
                icon: 'warning',
                allowOutsideClick: false,
                allowEscapeKey: false
            })
            
            return false;
        }
    
    }

    async function deleteUser(userId : number){

        try {
            const response = await api.delete(`/user/${userId}/delete`);
            
            if(response.status === 200){
    
                // Atualiza a lista de usuários após deletar
                try {
                    const usersResponse = await api.get('user');
                    setUsers(usersResponse.data);
                } catch (error) {
                    console.error('Erro ao atualizar lista de usuários:', error);
                    // Mesmo com erro ao atualizar, mostra sucesso da exclusão
                }
    
                await MySwal.fire({
                    title: <strong>Sucesso!</strong>,
                    html: <i>Usuário deletado com sucesso!</i>,
                    icon: 'success'
                })
    
            } else {
    
                await MySwal.fire({
                    title: <strong>Erro!</strong>,
                    html: <i>Usuário não pode ser deletado!</i>,
                    icon: 'error'
                })
    
            }
    
        } catch (error: any) {
            let errorMessage = 'Erro ao deletar usuário!';
            
            // Tratamento específico de tipos de erro
            if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
                errorMessage = 'Tempo de espera esgotado. Tente novamente.';
            } else if (error.code === 'ERR_NETWORK' || !error.response) {
                errorMessage = 'Sem conexão com o servidor. Verifique sua internet.';
            } else if (error.response?.status === 400) {
                errorMessage = 'Requisição inválida. Verifique o ID do usuário.';
            } else if (error.response?.status === 404) {
                errorMessage = 'Usuário não encontrado.';
            } else if (error.response?.status === 500) {
                errorMessage = 'Erro no servidor. Tente novamente mais tarde.';
            }
            
            await MySwal.fire({
                title: <strong>Erro!</strong>,
                html: <i>{errorMessage}</i>,
                icon: 'error'
            })
        }
    
    }



    return (<UsersContext.Provider value={{users, createUser, deleteUser}}>
        {children}
    </UsersContext.Provider>)
}



export function useUsers(){
    const context = useContext(UsersContext)

    return context
}