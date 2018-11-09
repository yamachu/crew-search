import * as React from 'react';
import { render } from 'react-dom';
import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
    body {
        margin: 0;
    }
`; // サイズとか

const App = () => {
    return (
        <>
            <GlobalStyle />
            {/* ここに実際のアプリ */}
        </>
    );
};

render(<App />, document.getElementById('root'));
