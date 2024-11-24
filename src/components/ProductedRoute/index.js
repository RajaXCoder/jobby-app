import Cookies from 'js-cookie'
import {Redirect, Route} from 'react-router-dom'

const ProductedRoute = props => {
  if (Cookies.get('jwt_token') === undefined) {
    return <Redirect to="/login" />
  }
  return <Route {...props} />
}

export default ProductedRoute
