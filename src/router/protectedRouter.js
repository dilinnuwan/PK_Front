
import { BrowserRouter as Route, Redirect, useHistory } from 'react-router-dom'


export const ProtectedRouter = ({ isLoggedIn, ...props }) => {
    const history = useHistory()
    isLoggedIn ? <Route { ...props } /> : <Redirect to="/" />
}