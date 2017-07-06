import React from 'react';
import GoogleLogin from 'react-google-login';

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = { tokenId: '' };
  }

  componentDidMount() {
    console.log(this.props, 'didmount');
  }

  responseGoogle(response) {
    console.log(this.props);
    console.log(response);
    this.setState({ tokenId: response.tokenId})
  }

  render () {
    return (
      <div className="row">
        <div className="col-xs-12 text-center">
          <GoogleLogin
            clientId="745992232545-a8c7pi5g0eoivjcmho0bdui4ui46d9vb.apps.googleusercontent.com"
            scope="profile email"
            buttonText="Login with Google"
            onSuccess={this.props.onSignIn}
            onFailure={this.responseGoogle.bind(this)}
            isSignedIn={true}
            className="btn btn-lg btn-danger"
          />
        </div>
      </div>
    )
  }
}

export default Login;
