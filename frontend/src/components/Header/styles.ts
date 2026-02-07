import styled from 'styled-components'

export const Container = styled.header `
    
    margin: 2rem 0 0 0;

    display: flex;
    justify-content: center;
    align-items: center;
`

export const Content = styled.div `

    background: var(--blue);
    border-radius: 0.5rem 0.5rem 0 0;
    width: 100%;
    max-width: 1200px;

    margin: 0 auto;
    padding: 2rem 1rem 4rem;
    display: flex;
    justify-content: center;
    align-items: center;

    img{
        padding: 0.5rem 0 0 0;
        width: 300px;
        height: auto;
    }

`