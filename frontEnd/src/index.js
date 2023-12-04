import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import './styles.css'
import App from './App'
import store from './redux/store'
import Loader from './components/Loader';

const root = ReactDOM.createRoot(document.getElementById('root'))

root.render(
    <Provider store = {store}>
        <BrowserRouter>
            <App />
            <Loader/>
        </BrowserRouter>
    </Provider>)