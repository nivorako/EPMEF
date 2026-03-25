"use client";

import styled from "styled-components";

const Page = styled.div`
    display: flex;
    min-height: 100vh;
    align-items: center;
    justify-content: center;
    background-color: ${({ theme }) => theme.colors.backgroundAlt};
`;

const Main = styled.main`
    display: flex;
    min-height: 100vh;
    width: 100%;
    max-width: 800px;
    flex-direction: column;
    align-items: flex-start;
    justify-content: space-between;
    background-color: ${({ theme }) => theme.colors.surface};
    padding: 120px 60px;

    @media (max-width: 600px) {
        padding: 48px 24px;
    }
`;

export default function Home() {
    return (
        <Page>
            <Main>
                <h1>Faly miarahaba antsika rehetra !!!</h1>
            </Main>
        </Page>
    );
}
