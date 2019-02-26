import React, { Component } from 'react';
import PrivateRoute from './components/PrivateRoute'
import ScreenSolicitaCompra from './compras/ScreenSolicitaCompra'
import ScreenViewCompras from './compras/ScreenViewCompras'
import ScreenLogin from './login/ScreenLogin';
import { BrowserRouter , Switch , Route} from 'react-router-dom';

class App extends Component {

  render() {
    return <BrowserRouter>
      <Switch>
        <PrivateRoute groups={[10001,10002]} exact path="/compras/solicita/" component={() => <ScreenSolicitaCompra/>} />
        <PrivateRoute groups={[10001,10002]} exact path="/compras/all/" component={() => <ScreenViewCompras/>} />
        <Route exact path="/login/" component={() => <ScreenLogin/>} />
        <Route exact path="*" component={() => <ScreenLogin/>} />
      </Switch>
    </BrowserRouter>;
  }


}
export default App;