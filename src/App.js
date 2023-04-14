// ** Router Import
// import Router from './router/Router'

// const App = props => <Router />

// export default App


// ** Router Import
// import Router from './router/Router'

// const App = props => <Router />

// export default App

import { BrowserRouter as AppRouter, Route, Switch, Redirect, useHistory, useLocation  } from 'react-router-dom'
import React, {lazy, Suspense, useEffect, useState} from 'react'
import Login from './views/Login'
import Home from './views/Home'
// ** Layouts
import BlankLayout from '@layouts/BlankLayout'
import VerticalLayout from '@src/layouts/VerticalLayout'
import HorizontalLayout from '@src/layouts/HorizontalLayout'
import LayoutWrapper from '@layouts/components/layout-wrapper'
import { useRouterTransition } from '@hooks/useRouterTransition'
import SecondPage from './views/SecondPage'
import { ProtectedRouter } from './router/protectedRouter'
// import {DefaultLayout} from './DefaultLayout'
import { useSelector, useDispatch } from "react-redux"
import { useLayout } from '@hooks/useLayout'
import * as config from './configs/config'
export default function App() {
    const history = useHistory()
     // ** All of the available layouts
    const Layouts = { BlankLayout, VerticalLayout, HorizontalLayout }
    const [layout, setLayout] = useLayout()
    const [transition, setTransition] = useRouterTransition()
    const NotAuthorized = lazy(() => import('@src/views/NotAuthorized'))
    // const userAuth = useSelector(state => state.userAuth.user)
    // const isLoggedin = userAuth.isLoggedin
    const [user, setUser] = useState();
    const currentActiveItem = null
    const routerProps = {}

    

    useEffect(() => {
        config.asyncLocalStorage.getItem('authUser').then(function (value) {
            const usr = JSON.parse(value)
            setUser(usr)
        })

      }, [])

    const ProtectedRoute = ({ component: Component, ...rest }) => (
    <Route {...rest} render={props => {
        if(!user && user?.isLoggedin == false){
            return <Redirect to='/login' />
        }

        return (
        <Layouts.VerticalLayout currentActiveItem={currentActiveItem} transition={transition} setTransition={setTransition}>
            <LayoutWrapper layout={VerticalLayout} transition={transition} setTransition={setTransition}>
                <Component {...props} />
            </LayoutWrapper>
        </Layouts.VerticalLayout>)


    }}/>)

    const PublicRoute =  ({ component: Component, ...rest }) => (<Route {...rest} render={props => <Component {...props} />}/>)

    const updateUser = (usr) =>{
        console.log('user trigger')
        config.asyncLocalStorage.setItem('authUser', JSON.stringify(usr)).then(function () {
            return config.asyncLocalStorage.getItem('authUser');
        }).then(function (value) {
            setUser(JSON.parse(value))
            console.log('user trigger value', JSON.parse(value))
        });
        
    }
    
    return (
        <AppRouter basename={process.env.REACT_APP_BASENAME}>
            
            <Switch>
                <ProtectedRoute path="/" component={Home} exact />
                <ProtectedRoute path="/Home" component={Home} exact />
                <ProtectedRoute path="/second-page" component={SecondPage} exact />
                
                <Route path='/login' exact render={() => {
                                
                    if(user?.isLoggedin == true){
                        window.location.href = "/home";
                    }
                    return (<Login triggerUser={updateUser} />)

                    
                }} />
                {/* <Route
                    exact
                    path='/not-authorized'
                    render={props => (
                        <Layouts.BlankLayout>
                        <NotAuthorized />
                        </Layouts.BlankLayout>
                    )}
                /> */}

            </Switch>
        </AppRouter>
    )
}
