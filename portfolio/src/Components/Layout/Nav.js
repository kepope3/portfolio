import React from "react";
import List from "../Shared/List";
import styles from "./../../Assets/CSS/Layout/Nav.module.css";
export default class extends React.Component {
  constructor(props) {
    super(props);
    this.state = { homeIconDisplayProp: "none" };
  }

  checkWindowHeightAndSetDisplayProp = (e, position) => {
    const a = position ? position : window.pageYOffset;
    if (a === 0) {
      this.setState({
        homeIconDisplayProp: "none",
      });
    } else {
      this.setState({
        homeIconDisplayProp: "block",
      });
    }
  };

  componentDidMount() {
    window.onscroll = this.checkWindowHeightAndSetDisplayProp;
  }

  render() {
    return (
      <div className={styles.nav}>
        <List
          styles={styles}
          list={[
            <a style={{ display: this.state.homeIconDisplayProp }} href="#home">
              <i className="fas fa-home" />
            </a>,
            <a href="#about">About</a>,
            <a href="#resume">Résumé</a>,
            <a href="#typingGame">Typing game</a>,
            <a href="#contact">Contact</a>,
          ]}
        />
      </div>
    );
  }
}
