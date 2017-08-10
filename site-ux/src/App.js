import React, { Component } from 'react';
import { setUserId } from './Store';
import { MainSite, MetaSite } from './data/Data';
import { List } from './List'
import './App.css';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

const posts = MainSite.posts;
const users = MainSite.users;
const predictions = MainSite.predictions;

class App extends Component {

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
    console.log(user);
    if (user) {
      userData = (
        <p>
          {user.displayname}, reputación: {user.rep}
        </p>
      );
      
      const userPreditions = predictions[userIndex];
      console.log(userPreditions);
      const p = userPreditions.map((v, ix) => { 
          console.log(ix, parseFloat(v));
          return { value: parseFloat(v), ix: ix };
      });
      const x = p.slice().sort((a,b) => b.value - a.value);
      const r = x.map(i => Object.assign(posts[i.ix], { prediction: i.value.toFixed(3) }));
      console.log(p, x, r);
      items.push(...r.slice(0,25));
    }

    return (
      <div className="App">
        <div className="App-header">
          <h1>Recomendaciones - Stack Overflow en español</h1>
          <h2>Un ejemplo de <a tabIndex="1" href="https://es.wikipedia.org/wiki/Filtrado_colaborativo">Collaborative Filtering</a> aplicado sobre las preguntas favoritas de los usuarios.</h2>
        </div>
        <p className="App-intro">
          Para comenzar, ingresa tu ID de usuario&nbsp;
          <input type="text" size="6" tabIndex="0" autoFocus style={style} onChange={(e) => this.props.setUserId(e.target.value)} />
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
