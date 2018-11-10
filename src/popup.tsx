import * as React from 'react';
import { render } from 'react-dom';
import GlobalStyle from './renderers/styles/global';

const Root = () => {
    return (
        <>
            <GlobalStyle />
            {/* ここに実際のアプリ */}
        </>
    );
};

render(<Root />, document.getElementById('root'));
