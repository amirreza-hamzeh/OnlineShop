import React from 'react'
import { render } from 'react-dom'
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import { Router, Route, hashHistory } from 'react-router'
import { createLogger } from 'redux-logger'
import thunkMiddleware from 'redux-thunk'
import promiseMiddleware from 'redux-promise-middleware'
import reducer from './reducers'
import {
  fetchAllDummyItems,
} from './actions'
import App from './containers/App'
import getMuiTheme from 'material-ui/styles/getMuiTheme'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import CheckoutContainer from './containers/CheckoutContainer'
import ProductDetailsContainer from './containers/ProductDetailsContainer'
import AuthContainer from './containers/AuthContainer'
import ProfileContainer from './containers/ProfileContainer'
import CartNotificationContainer from './containers/CartNotificationContainer'


const middleware = [
  thunkMiddleware,
  promiseMiddleware({
    promiseTypeSuffixes: ['REQ', 'ACK', 'ERR'],
  }),
];

if (process.env.NODE_ENV !== 'production') {
  middleware.push(createLogger());
}

const store = createStore(
  reducer,
  applyMiddleware(...middleware),
)

const muiTheme = getMuiTheme({
  textField: {
    focusColor: '#9fa5a8',
  },
})

store.dispatch(fetchAllDummyItems())

render(
  <Provider store={store}>
    <MuiThemeProvider muiTheme={muiTheme}>
      <div>
        <Router history={hashHistory}>
          <Route path="/" component={App} />
          <Route path="shop/:category" component={App} />
          <Route path="shop/:category/:productId" component={ProductDetailsContainer} />
          <Route path="product/:productId" component={ProductDetailsContainer} />
          <Route path="checkout" component={CheckoutContainer} />
          <Route path="sign-in" component={props => <AuthContainer {...props} mode="login" />} />
          <Route path="create-account" component={props => <AuthContainer {...props} mode="create" />} />
          <Route path="profile" component={ProfileContainer} />
        </Router>
        <CartNotificationContainer />
      </div>
    </MuiThemeProvider>
  </Provider>,
  document.getElementById('root')
)
