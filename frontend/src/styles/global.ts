import styled, { createGlobalStyle } from "styled-components";
import backgroundImage from "../assets/office-background.png"

export const GlobalStyle = createGlobalStyle`

    :root{
        --background: #F0F2F5;
        --title: #363F5F;
        --text: #969CB3;
        --blue: #5429CC;
        --light-blue: #6933FF;
        --red: #E62E4D;
        --green: #33CC95;
        --main-shape: #FFFFFF;
        --orange: #F05340;
        --gray: #6C6C6C;

        // background: url(${backgroundImage})  no-repeat center center fixed;
        // backdrop-filter: blur(10px);

        // -webkit-background-size: cover;
        // -moz-background-size: cover;
        // -o-background-size: cover;
        // background-size: cover;

        // -webkit-font-smoothing: antialiased;
    }

    *{
        margin: 0;
        border: 0;
        box-sizing: border-box;
    }

    body{

        height: 100%;
        background: url(${backgroundImage})  no-repeat center center fixed;

        -webkit-background-size: cover;
        -moz-background-size: cover;
        -o-background-size: cover;
        background-size: cover;

        -webkit-font-smoothing: antialiased;

    }

    body, input, text-area, button{
        font-family: 'Poppins', sans-serif;
        font-weight: 400;
    }

    h1, h2, h3, h4, h5, h6, strong{
        font-weight: 600;
    }

    html{

        @media (max-width: 1080px){
            font-size: 93.75%; // 15px
        }

        @media (max-width: 720px){
            font-size: 87.5%; // 14px
        }

    }

    button{
        cursor: pointer;
    }

    [disabled]{
        opacity: 0.6;
        cursor: not-allowed;
    }

    .react-modal-overlay{
        background: rgb(0, 0, 0, 0.5);

        position: fixed;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;

        display: flex;
        align-items: center;
        justify-content: center;
    }

    .react-modal-content{
        width: 100%;
        max-width: 576px;

        background: var(--background);
        padding: 3rem;
        border: 0;
        border-radius: 0.25rem;

        position: relative;
    }

    .react-modal-close{
        position: absolute;
        right: 1rem;
        top: 1.5rem;
        border: 0;
        background: transparent;

        transition: filter 0.2s;
        &:hover{
            filter: brightness(0.8);
        }
    }

    /* Estilos para Multiselect - Remover quadrado branco e exibir apenas nomes das empresas */
    .multiSelectContainer {
        .optionListContainer {
            max-height: 200px;
            overflow-y: auto;
        }
        
        .option {
            padding: 0.75rem 1rem !important;
            font-size: 1rem;
            display: flex !important;
            align-items: center !important;
            min-height: auto !important;
            height: auto !important;
            line-height: 1.5 !important;
            
            /* Remover quadrado branco e elementos vazios */
            > div:empty,
            > span:empty,
            > div[style*="background-color: white"],
            > div[style*="background-color: #fff"],
            > div[style*="background-color: #ffffff"],
            > div[style*="background: white"],
            > div[style*="background: #fff"],
            > div[style*="background: #ffffff"],
            > span[style*="background-color: white"],
            > span[style*="background-color: #fff"],
            > span[style*="background-color: #ffffff"],
            > div[style*="width"][style*="height"]:not(:has(*)):not(:has(text)),
            img:not([src]),
            img[src=""],
            img[src*="placeholder"],
            [class*="placeholder"],
            [class*="empty"],
            [class*="image"]:empty {
                display: none !important;
                width: 0 !important;
                height: 0 !important;
                visibility: hidden !important;
                opacity: 0 !important;
                margin: 0 !important;
                padding: 0 !important;
            }
            
            /* Remover qualquer div ou span que tenha apenas background branco sem conteúdo */
            > div:not(:has(*)):not(:has(text))[style*="background"],
            > span:not(:has(*)):not(:has(text))[style*="background"] {
                display: none !important;
            }
            
            /* Garantir que apenas o texto (nome da empresa) apareça */
            span:not(:empty):not([class*="placeholder"]):not([class*="empty"]),
            label {
                margin-left: 0 !important;
                padding-left: 0 !important;
                width: 100% !important;
                display: block !important;
                text-align: left !important;
                color: var(--title) !important;
            }
            
            /* Ajustar checkbox */
            input[type="checkbox"] {
                margin-right: 0.75rem;
                flex-shrink: 0;
                width: 18px;
                height: 18px;
            }
        }
        
        .searchBox {
            border: 1px solid #d7d7d7;
            border-radius: 0.25rem;
            padding: 0 1.5rem;
            min-height: 4rem;
            font-size: 1rem;
            width: 100%;
        }
    }
    
    /* Remover elementos vazios ou com background branco dentro das opções */
    .multiSelectContainer .option > div:empty,
    .multiSelectContainer .option > span:empty,
    .multiSelectContainer .option > div[style*="background-color: white"],
    .multiSelectContainer .option > div[style*="background-color: #fff"],
    .multiSelectContainer .option > div[style*="background-color: #ffffff"],
    .multiSelectContainer .option > div[style*="background: white"],
    .multiSelectContainer .option > div[style*="background: #fff"],
    .multiSelectContainer .option > div[style*="background: #ffffff"],
    .multiSelectContainer .option img:not([src]),
    .multiSelectContainer .option img[src=""],
    .multiSelectContainer .option [class*="placeholder"],
    .multiSelectContainer .option [class*="empty"] {
        display: none !important;
        width: 0 !important;
        height: 0 !important;
        visibility: hidden !important;
    }
    
    /* Regra específica para remover qualquer elemento que seja apenas um quadrado branco */
    .multiSelectContainer .option > div:not(:has(*)):not(:has-text),
    .multiSelectContainer .option > span:not(:has(*)):not(:has-text) {
        display: none !important;
    }
    
    /* Ocultar qualquer elemento filho que tenha width e height definidos mas esteja vazio */
    .multiSelectContainer .option > div[style*="width"][style*="height"]:empty,
    .multiSelectContainer .option > span[style*="width"][style*="height"]:empty {
        display: none !important;
    }


`