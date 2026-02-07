import styled from "styled-components";
import {darken, transparentize} from 'polished'

export const Container = styled.form `

    h2{
        color: var(--title);
        font-size: 1.5rem;
        margin-bottom: 2rem;
    }

    input, select{
        width: 100%;
        padding: 0 1.5rem;
        height: 4rem;
        border-radius: 0.25rem;

        border: 1px solid #d7d7d7;
        background: #e7e9ee;

        font-weight: 400;
        font-size: 1rem;

        &::placeholder{
            color: var(--title);
        }

        & + input, & + div{
            margin-top: 1rem;
        }
    }
    
    div {
        & + div {
            margin-top: 1rem;
        }
    }

    button[type="submit"]{
        width: 100%;
        padding: 0 1.5rem;
        height: 4rem;
        margin-top: 1.5rem;

        display:flex;
        justify-content: center;
        align-items: center;
        space-between: 1rem;

        background: var(--orange);
        color: #fff;

        border-radius: 0%.25rem;
        border: 0;

        font-size: 1rem;
        font-weight: 600;

        transition: filter 0.2s;

        &:hover{
            filter: brightness(0.9);
        }
    }
    

`;

export const TransactionTypeContainer = styled.div `

    /* width: 100%;
    display: flex;
    justify-content: space-between;

    button{
        width: 49%;
        height: 4rem;
        padding: 1rem;
        margin: 1rem 0;

        background: var(--background);
        border: 1px solid #d7d7d7;
        border-radius: 0.25rem;

        display: flex;
        align-items: center;
        justify-content: center;
        
        span{
            font-weight: 500;
            font-size: 1rem;
            padding: 1rem;
        }

    } */

    margin: 1rem 0;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 0.5rem;

`

interface RadioBoxPorps {
    isActive: boolean;
    activeColor: 'green' | 'red'
}

const colors = {
    green: '#33cc95',
    red: '#e52e40'
    
}

export const RadioBox = styled.button<RadioBoxPorps>`

    background: ${(props) => props.isActive
        ? transparentize(0.9, colors[props.activeColor])
        : 'transparent'};

    border: 1px solid #d7d7d7;
    border-radius: 0.25rem;

    height: 4rem;
    display: flex;
    align-items: center;
    justify-content: center;

    img{
        width: 20px;
        height: 20px;
    }
    
    span{
        display: inline-block;
        color: var(--title);
        font-weight: 500;
        font-size: 1rem;
        padding: 1rem;
    }

    transition: filter 0.2s;

    &:hover{
        border-color: ${darken(0.1, '#d7d7d7')};
    }
`