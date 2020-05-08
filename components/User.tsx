import React from 'react';
import { View, Text, AsyncStorage } from 'react-native';
import SignIn from './userComponents/SignIn';
import Account from './userComponents/Account';
import SignUp from './userComponents/SignUp';

export default class Home extends React.Component<{close: Function}> {
    state = {
        currentView: "MAIN",
        userId: ""
    }

    check_if_is_signed_in = async () => {
        try {
          const value = await AsyncStorage.getItem('USERID');
          if (value === null) {
            this.setState({currentView: "SIGNIN"})
          } else {
            this.setState({userId: value});
          }
        } catch (error) {
            this.setState({currentView: "SIGNIN"})
        }
    }; 

    store_user_id = async (id: String) => {
        try {
          await AsyncStorage.setItem('USERID', id);
        } catch (error) {
          // Error saving data
        }
    };

    delete_user_id = async () => {
        try {
          await AsyncStorage.removeItem('USERID', () => {
            this.props.close();
          })
        } catch(e) {
          
        }
    }

    componentDidMount() {
        this.check_if_is_signed_in();
    }

    sign_in_success = (id: String) => {
        this.store_user_id(id)
            .then(() => {
                this.props.close();
            });
    }

    render() {
        return (
            <View style={{flex: 1}}>
                <View style={{flex: 1, display: this.state.currentView === "SIGNIN" ? "flex" : "none"}}>
                    <SignIn signInSucces={this.sign_in_success} signUpClicked={() => this.setState({currentView: "SIGNUP"})} />
                </View>
                <View style={{flex: 1, display: this.state.currentView === "SIGNUP" ? "flex" : "none"}}>
                    <SignUp signInSucces={this.sign_in_success} signInClicked={() => this.setState({currentView: "SIGNIN"})} />
                </View>
                <View style={{flex: 1, display: this.state.currentView === "MAIN" ? "flex" : "none"}}>
                    <Account signOutClicked={() => this.delete_user_id()} />
                </View>
            </View>
        );
    }
}