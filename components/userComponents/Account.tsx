import React from 'react';
import { View, Text, StyleSheet, Button, AsyncStorage, TouchableOpacity, Image, ScrollView, Modal } from 'react-native';
import Superhero from '../Superhero';
import Dialog from "react-native-dialog";

export default class Account extends React.Component<{signOutClicked: Function}> {
    state = {
        username: "Loading...",
        savedHeros: [],
        superheroModalVisible: false,
        selectedSuperheroName: "",
        selectedSuperheroId: "",
        loadingSavedHeros: true,
        dialogVisible: false,
        deleteId: 0,
        noSuperherosSaved: false
    }

    get_user_id = async () => {
        const value = await AsyncStorage.getItem('USERID');
        return value;
    }

    componentDidMount() {
        this.get_user_id()
            .then(id => {
                this.fetch_user_saves(id);
                if(id !== null) {
                    fetch(`https://superheroshubapi.herokuapp.com/users/${id}`)
                        .then(res => res.json())
                        .then(data => {
                            this.setState({username: data.username});
                        })
                        .catch(err => console.log(err));
                }
            });
    }

    fetch_user_saves = (user_id: String) => {
        fetch(`https://superheroshubapi.herokuapp.com/saves/${user_id}`)
            .then(res => res.json())
            .then(data => {
                this.fetch_super_hereos(data);
            });
    }

    fetch_super_hereos = (data: Array<Object>) => {
        let heros = []
        data.forEach(da => {
            fetch("https://www.superheroapi.com/api.php/222080678854229/" + da.superheroId)
                .then(res => res.json())
                .then(d => {
                    heros.push({
                        name: d.name,
                        image: d.image.url,
                        id: da.superheroId
                    });
                    this.setState({savedHeros: heros, loadingSavedHeros: false});
                })
        });
        if(data.length === 0)
            this.setState({noSuperherosSaved: true, loadingSavedHeros: false});
    }

    x_clicked = (id) => {
        this.get_user_id()
            .then(uId => {
                fetch("https://superheroshubapi.herokuapp.com/saves/remove", {
                    method: "POST",
                    headers: {"Content-Type": "application/json"},
                    body: `{"userId": "${uId}", "superheroId": "${id}"}`
                })
            });
        this.setState({savedHeros: this.state.savedHeros.filter(d => d.id !== id), dialogVisible: false}, () => {
            if(this.state.savedHeros.length === 0)
                this.setState({noSuperherosSaved: true});
        });
    }

    render() {
        const results = this.state.savedHeros.map((r, i) => (
                <TouchableOpacity
                    key={i}
                    onPress={() => this.setState({superheroModalVisible: true, selectedSuperheroId: r.id, selectedSuperheroName: r.name})}
                >
                    <Modal
                        animationType="fade"
                        visible={this.state.superheroModalVisible}
                        onRequestClose={() => this.setState({superheroModalVisible: false})}
                    >
                        <Superhero superheroId={this.state.selectedSuperheroId} superheroName={this.state.selectedSuperheroName} />
                    </Modal>
                    <View style={styles.resultView}>
                        <Image
                            style={{width: 60, height: 60, borderRadius: 6}}
                            source={{uri: r.image}}
                        />
                        <View style={{flex: 1, justifyContent: "center", marginLeft: 10}}>
                            <Text style={styles.resultText}>{r.name} </Text>
                        </View>
                        <Text onPress={() => this.setState({dialogVisible: true, deleteId: r.id})} style={{color: "white", fontSize: 20}}>X</Text>
                    </View>
                </TouchableOpacity>
        ));
        return (
            <View style={styles.container}>
                <Dialog.Container visible={this.state.dialogVisible}>
                    <Dialog.Title>Remove this superhero</Dialog.Title>
                    <Dialog.Description>
                        Do you want to remove this superhero? You cannot undo this action.
                    </Dialog.Description>
                    <Dialog.Button label="Cancel" onPress={() => this.setState({dialogVisible: false})} />
                    <Dialog.Button label="Remove" onPress={() => this.x_clicked(this.state.deleteId)} />
                </Dialog.Container>
                <View style={styles.header}>
                    <Text style={{color: "white", fontSize: 20}}>{this.state.username}</Text>
                </View>
                <ScrollView style={{margin: 10}}>
                    <View style={{marginBottom: 10}}>
                        <Text style={{fontSize: 18, color: "white", fontWeight: "bold", margin: 10, display: this.state.loadingSavedHeros ? "flex" : "none"}}>Loading saved heros...</Text>
                        {results}
                        <Text style={{fontSize: 18, color: "white", fontWeight: "bold", margin: 10, display: this.state.noSuperherosSaved ? "flex" : "none"}}>No superheros saved!</Text>
                    </View>
                    <Button color="red" title="Sign Out" onPress={() => this.props.signOutClicked()} />
                </ScrollView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        display: "flex",
        flexDirection: "column",
        backgroundColor: '#0B3253'
    },
    header: {
        backgroundColor: "#2C9017",
        display: "flex",
        flexDirection: "row",
        color: "white",
        width: "100%",
        padding: 15
    },
    resultView: {
        padding: 10,
        borderBottomColor: "white",
        borderBottomWidth: 1,
        display: "flex",
        flexDirection: "row",
    },
    resultText: {
        color: "white",
        fontSize: 18,
    }
});