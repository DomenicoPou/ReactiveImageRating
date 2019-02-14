import React, { Component } from 'react';
import { Route } from 'react-router';
import { Layout } from './components/Layout';
import { Home } from './components/Home';
import { History } from './components/History';

export default class App extends Component {
    displayName = App.name

    constructor(props) {
        super(props);
        // Set the users session if it doesn't exist between 100000 - 999999
        if (sessionStorage.getItem('CustomerDataID') == null) {
            const rand = Math.round(100000 + Math.random() * (999999 - 100000));
            sessionStorage.setItem('CustomerDataID', rand);
        }
    }

    render() {
        return (
            <Layout>
                <Route exact path='/' component={Home} />
                <Route path='/history' component={History} />
            </Layout>
        );
    }
}
