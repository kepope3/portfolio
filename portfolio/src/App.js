import React, { Component } from "react";
import "./App.css";
import Layout from "./Components/Layout/Layout";
import styles from "./Assets/CSS/global.module.css";
import Body from "./Components/Body";

class App extends Component {
  render() {
    return (
      <div className={styles.global}>
        <Layout>
          <Body />
        </Layout>
      </div>
    );
  }
}

export default App;
