import React from 'react';
import { View, Modal, StatusBar } from 'react-native';
import Home from './components/Home';
import SearchResults from './components/SearchResults';

interface HomeState {
  superheroSearchName: String,
  searchResultModalVisible: Boolean
}

export default class App extends React.Component<{}, HomeState> {
  state = {
    superheroSearchName: "",
    searchResultModalVisible: false
  }

  home_search_clicked = (sN: String) => {
    this.setState({superheroSearchName: sN, searchResultModalVisible: true})
  }

  render() {
    return (
      <View style={{flex: 1}}>
        <StatusBar backgroundColor="#2C9017" />
        <Modal
          animationType="fade"
          visible={this.state.searchResultModalVisible}
          onRequestClose={() => this.setState({searchResultModalVisible: false})}
        >
          <SearchResults superheroName={this.state.superheroSearchName} />
        </Modal>
        <Home searchClicked={this.home_search_clicked} appName="SuperherosHub" />
      </View>
    );
  }
}