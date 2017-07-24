import React, { Component } from 'react';
import './Word.css';

class Word extends Component {

    render() {
        return (
            <div className="word__box">
                <p className="word__label">
                    {this.props.value}
                </p>
            </div>
        );
    }
}

export default Word;