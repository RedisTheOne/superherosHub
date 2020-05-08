import React from 'react';
import { Text, View, Image, StyleSheet, ScrollView, TouchableOpacity, Modal, FlatList } from 'react-native';
import Superhero from './Superhero';

export default class Home extends React.Component<{superheroName: String}, State> {
    state = {
        headerText: "Loading...",
        results: [],
        superheroModalVisible: false,
        selectedSuperheroName: "",
        selectedSuperheroId: ""
    }

    componentDidMount() {
        fetch("https://www.superheroapi.com/api.php/222080678854229/search/" + this.props.superheroName)
            .then(res => res.json())
            .then(res => {
                if(res.response === "success") 
                    this.setState({results: res.results, headerText: `${this.props.superheroName} | ${res.results.length === 1 ? "1 result" : `${res.results.length} results`}`})
                else
                    this.setState({headerText: "Found nothing :("})
            })
            .catch(err => console.log(err));
    }

    render() {
        const results = this.state.results.map((r, i) => {
            return (
                <TouchableOpacity
                    key={i}
                    onPress={() => {
                        this.setState({selectedSuperheroId: r.id, selectedSuperheroName: r.name, superheroModalVisible: true});
                    }}
                >
                    <View style={styles.resultView}>
                        <Image
                            style={{width: 60, height: 60, borderRadius: 6}}
                            source={{uri: r.image.url}}
                        />
                        <View style={{flex: 1, justifyContent: "center", marginLeft: 10}}>
                            <Text style={styles.resultText}>{r.name} </Text>
                        </View>
                    </View>
                </TouchableOpacity>
            )
        });
        return (
            <View style={{flex: 1, display: "flex"}}>
                <Modal
                    animationType="fade"
                    visible={this.state.superheroModalVisible}
                    onRequestClose={() => this.setState({superheroModalVisible: false})}
                >
                    <Superhero superheroId={this.state.selectedSuperheroId} superheroName={this.state.selectedSuperheroName} />
                </Modal>
                <View style={styles.header}>
                    <Text style={{color: "white", fontSize: 20}}>{this.state.headerText}</Text>
                </View>
                <ScrollView style={styles.container}>
                    {results}
                </ScrollView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#0B3253',
        flex: 1,
        padding: 15,
        paddingBottom: 60
    },
    header: {
        backgroundColor: "#2C9017",
        color: "white",
        width: "100%",
        padding: 15
    },
    resultView: {
        padding: 10,
        borderBottomColor: "white",
        borderBottomWidth: 1,
        display: "flex",
        flexDirection: "row"
    },
    resultText: {
        color: "white",
        fontSize: 18,
    }
});