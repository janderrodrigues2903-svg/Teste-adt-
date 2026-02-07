import { Container } from "../Dashboard/styles";
import { TransactionsTable } from "../TransactionsTable";
import Add from '@material-ui/icons/Add';

interface DashboardProps{
    onOpenNewUserModal: () => void
}

export function Dashboard({onOpenNewUserModal} : DashboardProps){
    return (
        <Container>
            <button type='button' onClick={onOpenNewUserModal} id="new-user"><Add />Novo Usuário</button>
            <TransactionsTable />
        </Container>
    )
}