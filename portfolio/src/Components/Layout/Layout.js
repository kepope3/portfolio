import React from "react";
import Banner from "./../Layout/Banner";
import Nav from "./Nav";
import LinkedInBubble from "./LinkedInBubble";
import backgroundImg from "./../../Assets/Images/cribbar2.JPG";

export default () => (
  <React.Fragment>
    <div id="home" />
    <Banner imgSrc={backgroundImg} />
    <Nav />
    <LinkedInBubble />
  </React.Fragment>
);
