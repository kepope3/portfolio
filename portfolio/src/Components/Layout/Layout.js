import React from "react";
import Section from "../Shared/Section";
import Nav from "./Nav";
import LinkedInBubble from "./LinkedInBubble";
import backgroundImg from "./../../Assets/Images/cribbar2.JPG";

export default ({ children }) => (
  <React.Fragment>
    <div id="home" />
    <Section
      backgroundStyle={{
        backgroundImage: "url('" + backgroundImg + "')"
      }}
    >
      <Nav />
    </Section>
    <LinkedInBubble />
    <div id="childrenWrapper">{children}</div>
  </React.Fragment>
);
