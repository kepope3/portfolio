import React from "react";
import Section from "./Section";
import Nav from "./Nav";
import LinkedInBubble from "./LinkedInBubble";
import backgroundImg from "./../../Assets/Images/cribbar2.JPG";

export default () => (
  <React.Fragment>
    <div id="home" />
    <Section
      backgroundStyle={{ backgroundImage: "url('" + backgroundImg + "')" }}
    >
      <Nav />
    </Section>
    <LinkedInBubble />
  </React.Fragment>
);
