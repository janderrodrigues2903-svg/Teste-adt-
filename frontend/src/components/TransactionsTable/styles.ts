import styled from 'styled-components'

export const Container = styled.div`

    margin-top: 1rem;

    table{
        width: 100%;
        border-spacing: 0 0.5rem;


        th{
            color: var(--text);
            font-weight: 400;
            text-align: left;
            padding: 1rem 2rem;
            font-weight: 500;
            line-height: 1.5rem;
        }

        td{
            background: var(--main-shape);
            border: 0;
            padding: 1rem 2rem;
            border-radius: 0%.25rem;
            color: var(--title);

            height: 5rem;

            &.deposit{
                color: var(--green);
            }
            &.withdraw{
                color: var(--red);
            }

            &:last-child{
                padding: 0;
                min-width: 9rem;

                button{
                    background: #696969;
                    border-radius: 0.2rem;
                    margin: 0 0.3rem 0 0;
                    justify-content: center;
                    align-items: center;
                    padding: 4px 0 0 0;

                    width: 2.5rem;
                    height: 2.5rem;

                    img{
                        width: 1.5rem;
                        height: 1.5rem;
                    }

                    &:hover{
                        filter: brightness(1.1)
                    }
                }
            }
        }
    }

`