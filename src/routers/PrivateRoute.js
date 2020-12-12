import React from 'react';
import { connect } from 'react-redux';
import { Redirect, Route } from 'react-router-dom';
import Header from './../components/Header';

export const PrivateRoute = ({ isAuthenticated, 
                               component: Component,
                               ...rest // This returns a variable containing everything that we did not destructure
                                }) => (
    <Route { ...rest } component={ (props) => (
        isAuthenticated ? 
            ( 
                <div>
                    <Header />     
                    <Component {...props} /> 
                </div>
            ) : ( 
                <Redirect to="/" /> 
            )
    )} />
);

const mapStateToProps = (state) => ({
    isAuthenticated: !!state.auth.uid
});

export default connect(mapStateToProps)(PrivateRoute);