import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, AsyncStorage, TouchableOpacity } from 'react-native';
import Dialog from 'react-native-dialog';

export default class Superhero extends React.Component<{superheroName: String, superheroId: String}> {
    state = {
      info: {},
      loaded: false,
      groupAffiliation: [],
      aliases: [],
      relatives: [],
      userLoggedIn: false,
      superheroSaved: false,
      userId: "",
      dialogVisible: false,
      dialogTitle: "",
      dialogBody: ""
    }

    componentDidMount() {
      this.check_if_is_signed_in();
      fetch("https://www.superheroapi.com/api.php/222080678854229/" + this.props.superheroId)
        .then(res => res.text())
        .then(res => {
          let response = res.replace("full-name", "fullName");
          response = response.replace("place-of-birth", "placeOfBirth");
          response = response.replace("group-affiliation", "groupAffiliation");
          response = JSON.parse(response);
          this.setState({info: response,
            loaded: true,
            groupAffiliation: response.connections.groupAffiliation.split(", "),
            aliases: response.biography.aliases,
            relatives:  response.connections.relatives.split("; ")
          })
        })
    }

    get_user_saves = (id) => {
      this.setState({userId: id});
      fetch(`http://superheroshubapi.herokuapp.com/saves/${id}`)
        .then(res => res.json())
        .then(data => {
          data.forEach(d => {
            if(d.superheroId === this.props.superheroId)
              this.setState({superheroSaved: true});
          })
        })
    }

    check_if_is_signed_in = async () => {
      try {
        const value = await AsyncStorage.getItem('USERID');
        if (value === null) {
          this.setState({userLoggedIn: false})
        } else {
          this.setState({userLoggedIn: true});
          this.get_user_saves(value);
        }
      } catch (error) {
        this.setState({userLoggedIn: false})
      }
    }

    save_button_clicked = () => {
      if(this.state.superheroSaved) {
        this.setState({superheroSaved: false, dialogBody: "Superhero removed successfuly!", dialogTitle: "Removed", dialogVisible: true});
        fetch("http://superheroshubapi.herokuapp.com/saves/remove", {
          method: "POST",
          headers: {"Content-Type": "application/json"},
          body: `{"userId": "${this.state.userId}", "superheroId": "${this.props.superheroId}"}`
        })
      } else {
        this.setState({superheroSaved: true, dialogBody: "Superhero saved successfuly!", dialogTitle: "Saved", dialogVisible: true});
        fetch("http://superheroshubapi.herokuapp.com/saves/save", {
          method: "POST",
          headers: {"Content-Type": "application/json"},
          body: `{"userId": "${this.state.userId}", "superheroId": "${this.props.superheroId}"}`
        })
      }
    }
    
    render() {
      if(!this.state.loaded)
        return (
          <View style={{display: "flex", justifyContent: "center", alignItems: "center", flex: 1, backgroundColor: "#0B3253"}}>
            <Text style={{color: "white", fontSize: 25}}>Loading...</Text>
          </View>
        );
      const groups = this.state.groupAffiliation.map((g, i) => {
        if(i === 0) {
          return (
            <View key={i} style={{padding: 10, borderBottomColor: "white", borderBottomWidth: 1, width: "100%", borderTopColor: "white", borderTopWidth: 1}}>
              <Text style={{color: "white", fontSize: 17}}>{g} </Text>
            </View>
          )
        }
        return (
          <View key={i} style={{padding: 10, borderBottomColor: "white", borderBottomWidth: 1, width: "100%"}}>
            <Text style={{color: "white", fontSize: 17}}>{g} </Text>
          </View>
        );
      });
      const aliases = this.state.aliases.map((g, i) => {
        if(i === 0) {
          return (
            <View key={i} style={{padding: 10, borderBottomColor: "white", borderBottomWidth: 1, width: "100%", borderTopColor: "white", borderTopWidth: 1}}>
              <Text style={{color: "white", fontSize: 17}}>{g} </Text>
            </View>
          )
        }
        return (
          <View key={i} style={{padding: 10, borderBottomColor: "white", borderBottomWidth: 1, width: "100%"}}>
            <Text style={{color: "white", fontSize: 17}}>{g} </Text>
          </View>
        );
      });
      const relatives = this.state.relatives.map((g, i) => {
        if(i === 0) {
          return (
            <View key={i} style={{padding: 10, borderBottomColor: "white", borderBottomWidth: 1, width: "100%", borderTopColor: "white", borderTopWidth: 1}}>
              <Text style={{color: "white", fontSize: 17}}>{g} </Text>
            </View>
          )
        }
        return (
          <View key={i} style={{padding: 10, borderBottomColor: "white", borderBottomWidth: 1, width: "100%"}}>
            <Text style={{color: "white", fontSize: 17}}>{g} </Text>
          </View>
        );
      });
      return (
        <View style={{flex: 1}}>
          <Dialog.Container visible={this.state.dialogVisible}>
            <Dialog.Title>{this.state.dialogTitle}</Dialog.Title>
              <Dialog.Description>
                  {this.state.dialogBody}
              </Dialog.Description>
              <Dialog.Button label="Ok" onPress={() => this.setState({dialogVisible: false})} />
          </Dialog.Container>
          <View style={styles.header}>
            <Text style={{color: "white", fontSize: 20}}>{this.props.superheroName}</Text>
            <View style={{flex: 1, alignItems: "flex-end", display: this.state.userLoggedIn ? "flex" : "none"}}>
              <TouchableOpacity onPress={() => this.save_button_clicked()}>
                <Image
                  style={{width: 30, height: 30}}
                  source={this.state.superheroSaved ? require("../images/save_button_2.png") : require("../images/save_button_1.png")}
                />
              </TouchableOpacity>
            </View>
          </View>
          <ScrollView style={styles.container}>
            <View style={{display: "flex", flexDirection: "row"}}>
              <Image
                source={{uri: this.state.info.image.url}}
                style={{width: 100, height: 100}}
              />
              <View style={{flex: 1, display: "flex", justifyContent: "center", alignItems: "center", marginLeft: 20}}>
                <Text style={{fontSize: 20, color: "white", width: "100%", textAlign: "center", paddingBottom: 10}}>{this.state.info.biography.fullName} </Text>
                <Text style={{fontSize: 18, color: "white", width: "100%", textAlign: "center", paddingTop: 10, borderTopColor: "white", borderTopWidth: 1}}>"{this.state.info.biography.publisher}"</Text>
              </View>
            </View>
            <Text style={{color: "white", fontSize: 20, paddingTop: 20, fontWeight: "bold", paddingBottom: 5}}>Stats:</Text>
            <View style={{width: "100%", marginBottom: 20}}>
              <View style={{padding: 10, borderBottomColor: "white", borderBottomWidth: 1, display: "flex", flexDirection: "row", borderTopColor: "white", borderTopWidth: 1}}>
                <View style={{backgroundColor: this.state.info.powerstats.intelligence > 90 ? "green" : this.state.info.powerstats.intelligence > 40 ? "orange" : "red", width: 52, height: 23}}></View>
                <Text style={{marginLeft: 10, color: "white", fontSize: 17}}>Intelligence: {this.state.info.powerstats.intelligence} </Text>
              </View>
              <View style={{padding: 10, borderBottomColor: "white", borderBottomWidth: 1, display: "flex", flexDirection: "row"}}>
                <View style={{backgroundColor: this.state.info.powerstats.strength > 90 ? "green" : this.state.info.powerstats.strength > 40 ? "orange" : "red", width: 52, height: 23}}></View>
                <Text style={{marginLeft: 10, color: "white", fontSize: 17}}>Strength: {this.state.info.powerstats.strength} </Text>
              </View>
              <View style={{padding: 10, borderBottomColor: "white", borderBottomWidth: 1, display: "flex", flexDirection: "row"}}>
                <View style={{backgroundColor: this.state.info.powerstats.speed > 90 ? "green" : this.state.info.powerstats.speed > 40 ? "orange" : "red", width: 52, height: 23}}></View>
                <Text style={{marginLeft: 10, color: "white", fontSize: 17}}>Speed: {this.state.info.powerstats.speed} </Text>
              </View>
              <View style={{padding: 10, borderBottomColor: "white", borderBottomWidth: 1, display: "flex", flexDirection: "row"}}>
                <View style={{backgroundColor: this.state.info.powerstats.durability > 90 ? "green" : this.state.info.powerstats.durability > 40 ? "orange" : "red", width: 52, height: 23}}></View>
                <Text style={{marginLeft: 10, color: "white", fontSize: 17}}>Durability: {this.state.info.powerstats.durability} </Text>
              </View>
              <View style={{padding: 10, borderBottomColor: "white", borderBottomWidth: 1, display: "flex", flexDirection: "row"}}>
                <View style={{backgroundColor: this.state.info.powerstats.power > 90 ? "green" : this.state.info.powerstats.power > 40 ? "orange" : "red", width: 52, height: 23}}></View>
                <Text style={{marginLeft: 10, color: "white", fontSize: 17}}>Power: {this.state.info.powerstats.power} </Text>
              </View>
              <View style={{padding: 10, borderBottomColor: "white", borderBottomWidth: 1, display: "flex", flexDirection: "row"}}>
                <View style={{backgroundColor: this.state.info.powerstats.combat > 90 ? "green" : this.state.info.powerstats.combat > 40 ? "orange" : "red", width: 52, height: 23}}></View>
                <Text style={{marginLeft: 10, color: "white", fontSize: 17}}>Combat: {this.state.info.powerstats.combat} </Text>
              </View>
            </View>
            <Text style={{color: "white", fontSize: 20, paddingTop: 20, fontWeight: "bold", paddingBottom: 5}}>Group affiliation:</Text>
            <View style={{width: "100%", marginBottom: 20}}>{groups}</View>
            <Text style={{color: "white", fontSize: 20, paddingTop: 20, fontWeight: "bold", paddingBottom: 5}}>Relatives:</Text>
            <View style={{width: "100%", marginBottom: 20}}>{relatives}</View>
            <Text style={{color: "white", fontSize: 20, paddingTop: 20, fontWeight: "bold", paddingBottom: 5}}>Aliases:</Text>
            <View style={{width: "100%", marginBottom: 30}}>{aliases}</View>
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
        padding: 15,
        display: "flex",
        flexDirection: "row"
    }
});