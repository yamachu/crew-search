import * as React from 'react';
import { render } from 'react-dom';
import { App } from './renderers/app';
import GlobalStyle from './renderers/styles/global';

const Root = () => {
    return (
        <>
            <GlobalStyle />
            <App />
        </>
    );
};

render(<Root />, document.getElementById('root'));
