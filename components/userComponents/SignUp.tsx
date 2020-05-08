import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, TextInput, TouchableWithoutFeedback } from 'react-native';

export default class SignUp extends React.Component<{signInClicked: Function, signInSucces: Function}> {
    state = {
        usernameValue: "",
        emailValue: "",
        passwordValue: "",
        notificationText: "User is not valid",
        notificationTitle: "Error",
        notificationOpacity: 0
    }

    validateEmail(mail) {
        const re = /^(([^<>()\]\\.,;:\s@"]+(\.[^<>()\]\\.,;:\s@"]+)*)|(".+"))@(([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (re.test(mail)) 
            return (true);
        return (false);
    }

    sign_up_clicked = () => {
        if(this.state.usernameValue === "" || this.state.passwordValue === "" || this.state.emailValue === "") {
            this.setState({notificationOpacity: 1, notificationTitle: "Error", notificationText: "Please enter the required values!"}, () => {
                setTimeout(() => {
                    this.setState({notificationOpacity: 0})
                }, 3000);
            });
        } else {
            let valid = true;
            let error = "";
            if(this.state.usernameValue.length > 10) {
                error = "Username length should be less than 10 characters!";
                valid = false;
            }
            if(this.state.usernameValue.includes(" ") && valid) {
                error = "Username shouldn't contain spaces!";
                valid = false;
            }
            if(this.state.passwordValue.includes(" ") && valid) {
                error = "Password shouldn't contain spaces!";
                valid = false;
            }
            if(!this.validateEmail(this.state.emailValue) && valid) {
                error = "Please enter a valid email!";
                valid = false;
            }

            if(!valid) {
                this.setState({notificationOpacity: 1, notificationTitle: "Error", notificationText: error}, () => {
                    setTimeout(() => {
                        this.setState({notificationOpacity: 0})
                    }, 3000);
                });
            } else {
                fetch("http://superheroshubapi.herokuapp.com/users/signup", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({username: this.state.usernameValue, password: this.state.passwordValue, email: this.state.emailValue})
                })
                    .then(res => res.json())
                    .then(data => {
                        if(data.status === "success") {
                            this.props.signInSucces(data.user._id);
                        } else {
                            this.setState({notificationOpacity: 1, notificationTitle: "Error", notificationText: "Username is taken! Please use another one."}, () => {
                                setTimeout(() => {
                                    this.setState({notificationOpacity: 0})
                                }, 3000);
                            });
                        }
                    });
            }
        }
    }

    render() {
        return (
            <View style={{flex: 1}}>

                <View style={{...styles.notification, opacity: this.state.notificationOpacity}}>
                    <Text style={{backgroundColor: "#3e3e3e", fontSize: 16, borderTopLeftRadius: 6, borderTopRightRadius: 6, padding: 8, color: "white"}}>{this.state.notificationTitle} </Text>
                    <Text style={{padding: 8, fontSize: 14}}>{this.state.notificationText}</Text>
                </View>

                <View style={styles.container}>
                    <Image
                        source={require('../../images/ic_launcher_round.png')}
                        style={{width: 100, height: 100, marginBottom: 5}}
                    />
                    <TextInput value={this.state.usernameValue} onChangeText={(e) => this.setState({usernameValue: e})} style={styles.textInput} placeholder="Username" />
                    <TextInput value={this.state.emailValue} onChangeText={(e) => this.setState({emailValue: e})} style={styles.textInput} placeholder="Email" />
                    <TextInput value={this.state.passwordValue} secureTextEntry={true} onChangeText={(e) => this.setState({passwordValue: e})} style={styles.textInput} placeholder="Password" />
                    <TouchableOpacity onPress={() => this.sign_up_clicked()} style={styles.button}><Text style={{fontSize: 16, color: "white", textAlign: "center"}}>Sign Up</Text></TouchableOpacity>
                </View>

                <TouchableWithoutFeedback onPress={() => this.props.signInClicked()}>
                    <View style={styles.footer}>
                        <Text style={{textAlign: "center", color: "white", fontSize: 16}}>Already have an account? Sign in.</Text>
                    </View>
                </TouchableWithoutFeedback>

            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: '#0B3253',
        padding: 20
    },
    footer: {
        padding: 10,
        justifyContent: "center",
        backgroundColor: "#2C9017",
        borderTopColor: "white",
        borderTopWidth: 1
    },
    textInput: {
        width: "100%",
        padding: 6,
        marginTop: 8,
        marginBottom: 8,
        fontSize: 16,
        color: "white",
        backgroundColor: "#1c4966",
        borderRadius: 6
    },
    button: {
        backgroundColor: "#2C9017",
        width: "100%",
        padding: 8,
        margin: 5,
        borderRadius: 6
    },
    notification: {
        backgroundColor: "white",
        width: 200,
        borderRadius: 6,
        position: "absolute",
        top: 5,
        right: 5,
        zIndex: 999
    }
})