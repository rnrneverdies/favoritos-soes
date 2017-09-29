import React, { Component } from 'react';
import { setUserId } from './Store';
import { MainSite /*, MetaSite*/ } from './data/Data';
import { List } from './List'
import './App.css';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

const posts = MainSite.posts;
const users = MainSite.users;
const predictions = MainSite.predictions;

class App extends Component {

  componentDidMount() {
    try {
      const user = parseInt(window.location.hash.toString().substring(1));
      if (user) {
        console.log('setting user to:' + user);
        this.props.setUserId(user);
      }
    } catch (e) {}
  }

  render() {
    const items = [];
    const style = {};
    const userId = this.props.user.id;

    if (userId && isNaN(userId)) {
      style.color = 'red';
    }

    console.log(userId);
    const userIndex = users.findIndex(u => u.id == userId);
    const user = users[userIndex];
    let userData = null;
    console.log('user', user);
    if (user) {
      userData = (
        <p>
          {user.displayname}, reputación: {user.rep}
        </p>
      );

      const userPreditions = predictions[userIndex];
      const p = userPreditions.map((v, ix) => ({ value: parseFloat(v), ix: ix }));
      console.log(userPreditions);
      const x = p.slice().sort((a,b) => b.value - a.value);
      const r = x.map(i => Object.assign(posts[i.ix], { prediction: i.value.toFixed(3) }));
      console.log(r);
      items.push(...r.slice(0, 100));
      window.location.hash = userId;
    } else if (userId) {
      const randomUser = users[Math.floor(Math.random() * users.length)];
      userData = (
          <p>
            El usuario ha marcado menos de tres preguntas como favoritas o no existe un usuario con id {userId}. <a href="#" onClick={(e) => this.props.setUserId(randomUser.id)}>Ver un ejemplo</a>
          </p>
      )
    }

    return (
      <div className="App">
        <div className="App-header">
          <h1>Recomendaciones / Favoritos de Stack Overflow en español</h1>
          <h2>Esta app es un ejemplo de <a tabIndex="1" href="https://es.wikipedia.org/wiki/Filtrado_colaborativo">Collaborative Filtering</a> aplicado sobre las preguntas marcadas como favoritas por los usuarios de StackOverflow en Español. <a href="https://github.com/rnrneverdies/favoritos-soes">Fuentes en GitHub.</a></h2>
        </div>
        <p className="App-intro">
          Para comenzar, ingresa tu ID de usuario&nbsp;
          <input type="text" size="6" value={userId} tabIndex="0" autoFocus style={style} onInput={(e) => this.props.setUserId(e.target.value)} />
        </p>
        {userData}
        <List items={items} />
      </div>
    );
  }
}

function mapStateToProps(state, props) {
    return {
        user: state.user
    };
}

function mapDispatchToProps(dispatch) {
    return {
        setUserId: bindActionCreators(setUserId, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
