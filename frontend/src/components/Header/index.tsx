import logoImg from '../../assets/logo.png'
import { Container, Content } from './styles'

interface HeaderProps {
    onOpenNewTransactionModal: () => void
}

export function Header(){
    return(
        <Container>
            <Content>
                <img src={logoImg} alt="contatoseguro"/>
            </Content>
        </Container>
    )
}