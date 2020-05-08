import React from 'react';
import { Text, View, StyleSheet, StatusBar, Image, Dimensions, TextInput, ScrollView, TouchableOpacity, ToastAndroid, TouchableOpacityComponent, Modal } from 'react-native';
import User from './User';

type HomeState = {
    inputValue: String,
    userModalVisible: Boolean
}

export default class Home extends React.Component<{appName: String, searchClicked: Function}, HomeState> {
    state = {
        inputValue: "",
        userModalVisible: false
    }

    search_clicked = () => {
        if(this.state.inputValue.length === 0) 
            ToastAndroid.show("Please enter a name!", ToastAndroid.SHORT);
        else
            this.props.searchClicked(this.state.inputValue);
    }

    render() {
        return (
            <View style={{flex: 1, display: "flex"}}>
                <Modal
                    animationType="fade"
                    onRequestClose={() => this.setState({userModalVisible: false})}
                    visible={this.state.userModalVisible}
                >
                    <User
                        close={() => this.setState({userModalVisible: false})} 
                    />
                </Modal>
                <View style={styles.header}>
                    <Text style={{color: "white", fontSize: 20}}>{this.props.appName}</Text>
                    <View style={{flex: 1, display: "flex", flexDirection: "row", justifyContent: "flex-end"}}>
                        <TouchableOpacity
                            onPress={() => this.setState({userModalVisible: true})}
                        >
                            <Image
                                source={require("../images/userIcon.png")}
                                style={{width: 28, height: 27}}
                            />
                        </TouchableOpacity>
                    </View>
                </View>
                <ScrollView style={styles.container}>
                    <Image
                        source={require("../images/poster1.jpg")}
                        style={styles.image}
                    />
                    <View style={{margin: 40, alignItems: "center"}}>
                        <Text style={{fontSize: 20, color: "white"}}>Search your superhero</Text>
                        <View style={{width: "100%", display: "flex", flexDirection: "row", marginTop: 15}}>
                            <TextInput style={styles.textInput}  onChangeText={(e) => this.setState({inputValue: e})} />
                            <TouchableOpacity
                                onPress={() => {
                                    this.search_clicked();
                                }}
                            >
                                <Image 
                                    style={{width: 40, height: 40, borderTopRightRadius: 6, borderBottomRightRadius: 6}}
                                    source={require("../images/searchButton.png")}
                                />
                                </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#0B3253',
        flex: 1,
    },
    header: {
        backgroundColor: "#2C9017",
        display: "flex",
        flexDirection: "row",
        color: "white",
        width: "100%",
        padding: 15
    },
    image: {
        width: "100%",
        height: Math.round(Dimensions.get('window').width)
    },
    textInput: {
        borderColor: "white",
        borderWidth: 1,
        color: "white",
        flex: 1,
        fontSize: 18,
        padding: 5,
        borderTopLeftRadius: 6,
        borderBottomLeftRadius: 6

    }
});
  