import styled from 'styled-components'

export const Container = styled.main `
    background: var(--background);
    border-radius: 0 0 0.5rem 0.5rem;
    max-width: 1200px;
    margin: 0 auto;
    padding: 2.5rem 1rem;

    button#new-user{
        font-size: 1rem;
        color: #FFF;
        background: #696969;
        border: 0;
        padding: 0 2rem;
        margin: 0 0 0 1rem;
        border-radius: 0.25rem;
        height: 3rem;
        transition: filter 0.2s;

        display:flex;
        align-items: center;
        justify-content: center;

        &:hover{
            filter: brightness(0.9);
        }
    }

`