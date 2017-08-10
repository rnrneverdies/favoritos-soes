import React, { Component } from 'react';

export class List extends Component {
  render() {
    if (this.props.loading) {
        return (<Loading />);
    }

    return (
      <ul className="List">
        {this.props.items.map((item) => <Item key={item.id} {...item} />)}
      </ul>
    );
  }
}

export class Item extends Component {
  render() {
    return (
      <li><span style={{ color: 'red' }}>{this.props.prediction}</span><span className="star-off" />{this.props.title}</li>
    );
  }
}

function Loading(props) {
    return (
        <p>loading...</p>
    );
}