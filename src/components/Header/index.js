import {withRouter, Link} from 'react-router-dom'
import Cookies from 'js-cookie'

import './index.css'

const Header = props => {
  const onClickLogout = () => {
    const {history} = props
    Cookies.remove('jwt_token')
    history.replace('/login')
  }
  return (
    <nav className="nav-container">
      <ul className="menu-item-container">
        <li className="header-items">
          <Link to="/" className="link-text">
            <img
              src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
              alt="website logo"
              className="nav-website-logo"
            />
          </Link>
        </li>

        <li className="header-items">
          <Link to="/" className="link-text">
            Home
          </Link>
          <Link to="/jobs" className="link-text">
            Jobs
          </Link>
        </li>

        <li className="header-items">
          <button type="button" className="logout-btn" onClick={onClickLogout}>
            Logout
          </button>
        </li>
      </ul>
    </nav>
  )
}

export default withRouter(Header)
