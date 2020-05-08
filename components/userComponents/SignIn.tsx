import React from 'react';
import { View, Text, StyleSheet, Image, TouchableWithoutFeedback, TextInput, TouchableOpacity } from 'react-native';

export default class SignIn extends React.Component<{signUpClicked: Function, signInSucces: Function}> {
    state = {
        usernameValue: "",
        passwordValue: "",
        notificationText: "User is not valid",
        notificationTitle: "Error",
        notificationOpacity: 0
    }

    sign_in_clicked = () => {
        if(this.state.usernameValue !== "" || this.state.passwordValue !== "") {
            fetch("http://superheroshubapi.herokuapp.com/users/signin", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({username: this.state.usernameValue, password: this.state.passwordValue})
            })
                .then(res => res.json())
                .then(data => {
                    console.log(data)
                    if(data.status === "success") {
                        this.props.signInSucces(data.user._id);
                    } else {
                        this.setState({notificationOpacity: 1, notificationTitle: "Error", notificationText: "User is not valid!"}, () => {
                            setTimeout(() => {
                                this.setState({notificationOpacity: 0})
                            }, 3000);
                        });
                    }
                });
        } else {
            this.setState({notificationOpacity: 1, notificationTitle: "Error", notificationText: "Please enter the required values!"}, () => {
                setTimeout(() => {
                    this.setState({notificationOpacity: 0})
                }, 3000);
            });
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
                    <TextInput secureTextEntry={true} value={this.state.passwordValue} onChangeText={(e) => this.setState({passwordValue: e})} style={styles.textInput} placeholder="Password" />
                    <TouchableOpacity onPress={() => this.sign_in_clicked()} style={styles.button}><Text style={{fontSize: 16, color: "white", textAlign: "center"}}>Sign In</Text></TouchableOpacity>
                </View>

                <TouchableWithoutFeedback onPress={() => this.props.signUpClicked()}>
                    <View style={styles.footer}>
                        <Text style={{textAlign: "center", color: "white", fontSize: 16}}>Don't have an account? Sign up.</Text>
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