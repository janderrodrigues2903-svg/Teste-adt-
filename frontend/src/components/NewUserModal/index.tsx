import { Container } from "./styles";
import { FormEvent, useState, useEffect } from "react";
import { Save } from "@material-ui/icons";
import Modal from 'react-modal';
import {Multiselect} from 'multiselect-react-dropdown';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const MySwal = withReactContent(Swal);

import closeImg from '../../assets/close.svg'
import { useUsers } from "../../hooks/useUsers";
import { api } from "../../services/api";

interface NewUserModalProps {
    isOpen: boolean;
    onRequestClose: () => void;
} 

interface Company {
    id: number,
    name: string
}

interface CompanyApiResponse {
    id_company: number,
    name: string,
    cnpj: string,
    show: number
}

export function NewUserModal({isOpen, onRequestClose}: NewUserModalProps){
    const {createUser} = useUsers()

    const multiselectStyle = {
        chips: { // Chips das empresas selecionadas
            background: 'var(--blue)',
            color: '#fff'
        },
        multiselectContainer: {
            color: 'var(--title)',
            width: '100%'
        },
        searchBox: {
            border: '1px solid #d7d7d7',
            borderRadius: '0.25rem',
            padding: '0 1.5rem',
            minHeight: '4rem',
            fontSize: '1rem',
            width: '100%'
        },
        optionContainer: {
            maxHeight: '200px',
            overflowY: 'auto',
            border: '1px solid #d7d7d7',
            borderRadius: '0.25rem',
            width: '100%'
        },
        option: {
            padding: '0.75rem 1rem',
            fontSize: '1rem',
            display: 'flex',
            alignItems: 'center',
            minHeight: 'auto',
            lineHeight: '1.5'
        }
    }
    
    const [selectCompanies, setSelectCompanies] = useState<Company[]>([])
    const [isLoadingCompanies, setIsLoadingCompanies] = useState(false)

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [telephone, setTelephone] = useState('')
    const [birth_date, setBirth_date] = useState('')
    const [birth_city, setBirth_city] = useState('')
    const [companies, setCompanies] = useState([0])
    const [isLoading, setIsLoading] = useState(false)
    
    // Estados para mensagens de validação
    const [nameValid, setNameValid] = useState<boolean | null>(null)
    const [emailValid, setEmailValid] = useState<boolean | null>(null)
    const [telephoneValid, setTelephoneValid] = useState<boolean | null>(null)
    const [birthCityValid, setBirthCityValid] = useState<boolean | null>(null)

    // Buscar empresas da API quando o modal abrir
    useEffect(() => {
        if (isOpen) {
            loadCompanies();
        } else {
            setSelectCompanies([]);
        }
    }, [isOpen])

    async function loadCompanies() {
        setIsLoadingCompanies(true);
        try {
            const response = await api.get<CompanyApiResponse[]>('company');
            
            // Mapear dados da API para o formato esperado pelo Multiselect
            const companiesFormatted = response.data.map(company => ({
                id: company.id_company,
                name: company.name
            }));
            
            setSelectCompanies(companiesFormatted);
        } catch (error) {
            console.error('Erro ao carregar empresas:', error);
            await MySwal.fire({
                title: <strong>Erro!</strong>,
                html: <i>Erro ao carregar empresas. Tente novamente.</i>,
                icon: 'error'
            });
            setSelectCompanies([]);
        } finally {
            setIsLoadingCompanies(false);
        }
    }
    

    // Funções de validação individual para cada campo
    function validateName(value: string): boolean {
        if (!value || value.trim().length === 0) {
            return false;
        }
        if (value.trim().length < 2 || value.trim().length > 100) {
            return false;
        }
        return true;
    }

    function validateEmail(value: string): boolean {
        if (!value || value.trim().length === 0) {
            return false;
        }
        if (!value.includes('@')) {
            return false;
        }
        return true;
    }

    function validateTelephone(value: string): boolean {
        if (!value || value.trim().length === 0) {
            return true; // Opcional, então vazio é válido
        }
        const phoneNumbersOnly = value.replace(/\D/g, '');
        if (phoneNumbersOnly.length !== value.trim().length) {
            return false;
        }
        if (value.trim().length < 8 || value.trim().length > 15) {
            return false;
        }
        return true;
    }

    function validateBirthCity(value: string): boolean {
        if (!value || value.trim().length === 0) {
            return true; // Opcional, então vazio é válido
        }
        if (value.trim().length < 2 || value.trim().length > 100) {
            return false;
        }
        return true;
    }

    // Função para validar os campos do formulário
    async function validateForm(): Promise<boolean> {
        // Validação do Nome
        if (!name || name.trim().length === 0) {
            await MySwal.fire({
                title: <strong>Atenção!</strong>,
                html: <i>O campo Nome é obrigatório!</i>,
                icon: 'warning',
                allowOutsideClick: false,
                allowEscapeKey: false
            });
            return false;
        }
        
        if (name.trim().length < 2) {
            await MySwal.fire({
                title: <strong>Atenção!</strong>,
                html: <i>O campo Nome deve ter no mínimo 2 caracteres!</i>,
                icon: 'warning',
                allowOutsideClick: false,
                allowEscapeKey: false
            });
            return false;
        }
        
        if (name.trim().length > 100) {
            await MySwal.fire({
                title: <strong>Atenção!</strong>,
                html: <i>O campo Nome deve ter no máximo 100 caracteres!</i>,
                icon: 'warning',
                allowOutsideClick: false,
                allowEscapeKey: false
            });
            return false;
        }

        // Validação do Email
        if (!email || email.trim().length === 0) {
            await MySwal.fire({
                title: <strong>Atenção!</strong>,
                html: <i>O campo Email é obrigatório!</i>,
                icon: 'warning',
                allowOutsideClick: false,
                allowEscapeKey: false
            });
            return false;
        }
        
        if (!email.includes('@')) {
            await MySwal.fire({
                title: <strong>Atenção!</strong>,
                html: <i>O campo Email deve conter o símbolo @!</i>,
                icon: 'warning',
                allowOutsideClick: false,
                allowEscapeKey: false
            });
            return false;
        }

        // Validação do Telefone (se preenchido)
        if (telephone && telephone.trim().length > 0) {
            // Validar se contém apenas números
            const phoneNumbersOnly = telephone.replace(/\D/g, ''); // Remove tudo que não é número
            if (phoneNumbersOnly.length !== telephone.trim().length) {
                await MySwal.fire({
                    title: <strong>Atenção!</strong>,
                    html: <i>O campo Telefone deve conter apenas números!</i>,
                    icon: 'warning',
                    allowOutsideClick: false,
                    allowEscapeKey: false
                });
                return false;
            }
            
            const phoneLength = telephone.trim().length;
            if (phoneLength < 8) {
                await MySwal.fire({
                    title: <strong>Atenção!</strong>,
                    html: <i>O campo Telefone deve ter no mínimo 8 caracteres!</i>,
                    icon: 'warning',
                    allowOutsideClick: false,
                    allowEscapeKey: false
                });
                return false;
            }
            
            if (phoneLength > 15) {
                await MySwal.fire({
                    title: <strong>Atenção!</strong>,
                    html: <i>O campo Telefone deve ter no máximo 15 caracteres!</i>,
                    icon: 'warning',
                    allowOutsideClick: false,
                    allowEscapeKey: false
                });
                return false;
            }
        }

        // Validação da Cidade de nascimento (se preenchida)
        if (birth_city && birth_city.trim().length > 0) {
            const cityLength = birth_city.trim().length;
            if (cityLength < 2) {
                await MySwal.fire({
                    title: <strong>Atenção!</strong>,
                    html: <i>O campo Cidade de nascimento deve ter no mínimo 2 caracteres!</i>,
                    icon: 'warning',
                    allowOutsideClick: false,
                    allowEscapeKey: false
                });
                return false;
            }
            
            if (cityLength > 100) {
                await MySwal.fire({
                    title: <strong>Atenção!</strong>,
                    html: <i>O campo Cidade de nascimento deve ter no máximo 100 caracteres!</i>,
                    icon: 'warning',
                    allowOutsideClick: false,
                    allowEscapeKey: false
                });
                return false;
            }
        }

        // Validação: Verificar se a data de nascimento não é futura
        if (birth_date) {
            const selectedDate = new Date(birth_date);
            const today = new Date();
            today.setHours(0, 0, 0, 0); // Resetar horas para comparar apenas datas
            
            if (selectedDate > today) {
                await MySwal.fire({
                    title: <strong>Atenção!</strong>,
                    html: <i>A data de nascimento não pode ser futura!</i>,
                    icon: 'warning',
                    allowOutsideClick: false,
                    allowEscapeKey: false
                });
                return false;
            }
        }

        return true;
    }

    async function handleCreateNewUser(event: FormEvent){
        event.preventDefault();

        // Previne múltiplos cliques durante requisição
        if (isLoading) {
            return;
        }

        // Valida todos os campos do formulário
        const isValid = await validateForm();
        if (!isValid) {
            return; // Impede o envio do formulário se houver erro de validação
        }

        // Ativa loading
        setIsLoading(true);

        try {
            // Chama createUser e aguarda o resultado
            const success = await createUser({
                name,
                email,
                telephone,
                birth_date,
                birth_city,
                companies
            })

            // IMPORTANTE: Só fecha o modal e reseta os valores se o cadastro foi bem-sucedido
            // Se success === false (empresa não selecionada ou erro na API), o modal permanece aberto
            if (success === true) {
                // Reset dos valores do formulário
                setName('')
                setEmail('')
                setTelephone('')
                setBirth_date('')
                setBirth_city('')
                setCompanies([0])
                
                // Reset das validações
                setNameValid(null)
                setEmailValid(null)
                setTelephoneValid(null)
                setBirthCityValid(null)

                // Fecha o modal apenas após sucesso
                onRequestClose()
            }
            // Se success === false, o modal permanece aberto para o usuário corrigir o erro
        } finally {
            // Desativa loading sempre, mesmo em caso de erro
            setIsLoading(false);
        }
    }

    Modal.setAppElement('#root')

    return (
        <Modal
        isOpen={isOpen}
        onRequestClose={onRequestClose}
        overlayClassName="react-modal-overlay"
        className="react-modal-content"
        shouldCloseOnOverlayClick={true}
        shouldCloseOnEsc={true}>

            <button
            type="button"
            onClick={onRequestClose}
            className="react-modal-close">
                <img src={closeImg} alt="Close modal"/>
            </button>

            <Container
            onSubmit={handleCreateNewUser}>
                <h2>Cadastrar novo usuário</h2>

                <div>
                    <input
                    placeholder="Nome"
                    type="text"
                    required
                    value={name}
                    maxLength={100}
                    onChange={event => {
                        setName(event.target.value);
                        setNameValid(null); // Reset validação ao digitar
                    }}
                    onBlur={() => {
                        if (name.trim().length > 0) {
                            setNameValid(validateName(name));
                        }
                    }}/>
                    {nameValid === true && (
                        <span style={{ color: '#33CC95', fontSize: '0.875rem', marginTop: '0.25rem', display: 'block' }}>
                            ✓ Nome válido
                        </span>
                    )}
                </div>

                <div>
                    <input
                    placeholder="Email"
                    type="email"
                    required
                    value={email}
                    onChange={event => {
                        setEmail(event.target.value);
                        setEmailValid(null); // Reset validação ao digitar
                    }}
                    onBlur={() => {
                        if (email.trim().length > 0) {
                            setEmailValid(validateEmail(email));
                        }
                    }}/>
                    {emailValid === true && (
                        <span style={{ color: '#33CC95', fontSize: '0.875rem', marginTop: '0.25rem', display: 'block' }}>
                            ✓ Email válido
                        </span>
                    )}
                </div>

                <div>
                    <input
                    placeholder="Telefone"
                    type="text"
                    value={telephone}
                    maxLength={15}
                    onChange={event => {
                        // Permite apenas números
                        const value = event.target.value.replace(/\D/g, '');
                        setTelephone(value);
                        setTelephoneValid(null); // Reset validação ao digitar
                    }}
                    onBlur={() => {
                        if (telephone.trim().length > 0) {
                            setTelephoneValid(validateTelephone(telephone));
                        }
                    }}/>
                    {telephoneValid === true && (
                        <span style={{ color: '#33CC95', fontSize: '0.875rem', marginTop: '0.25rem', display: 'block' }}>
                            ✓ Telefone válido
                        </span>
                    )}
                </div>

                <div>
                    <input
                    placeholder="Cidade de nascimento"
                    type="text"
                    value={birth_city}
                    maxLength={100}
                    onChange={event => {
                        setBirth_city(event.target.value);
                        setBirthCityValid(null); // Reset validação ao digitar
                    }}
                    onBlur={() => {
                        if (birth_city.trim().length > 0) {
                            setBirthCityValid(validateBirthCity(birth_city));
                        }
                    }}/>
                    {birthCityValid === true && (
                        <span style={{ color: '#33CC95', fontSize: '0.875rem', marginTop: '0.25rem', display: 'block' }}>
                            ✓ Cidade válida
                        </span>
                    )}
                </div>

                <input 
                placeholder="Data de nascimento"
                type="date"
                required
                onChange={event => setBirth_date(new Date(event.target.value).toISOString().split('T')[0])}/>

                <Multiselect
                    placeholder={isLoadingCompanies ? "Carregando empresas..." : "Selecione as empresas"}
                    style={multiselectStyle}
                    emptyRecordMsg="Nenhuma empresa encontrada"
                    options={selectCompanies}
                    disabled={isLoadingCompanies}
                    showCheckbox={true}
                    avoidHighlightFirstOption={false}
                    hidePlaceholder={false}
                    closeOnSelect={false}
                    onSelect={event => {
                        let selected:number[] = []

                        event.forEach((company:Company) => {
                            selected.push(company.id)
                            setCompanies(selected)
                        })
                    }}
                    onRemove={event => {
                        let selected:number[] = []

                        event.forEach((company:Company) => {
                            selected.push(company.id)
                            setCompanies(selected)
                        })
                    }}
                    displayValue="name"
                />

                <button type="submit" disabled={isLoading}>
                    {isLoading ? (
                        <>Carregando...</>
                    ) : (
                        <><Save />Salvar</>
                    )}
                </button>
            </Container>

      </Modal>
    )
}