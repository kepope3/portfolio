import React from "react";
import Section from "../Shared/Section";
import AboutContent from "./AboutContent";
import ResumeContent from "./ResumeContent";
import ContactContent from "./ContactContent";
import TypingGame from "./TypingGame/TypingGame";

export default () => (
  <React.Fragment>
    <div id="about">
      <Section
        backgroundStyle={{
          backgroundImage: "linear-gradient(10deg, #887f7f, black)",
        }}
      >
        <AboutContent />
      </Section>
    </div>
    <div id="resume">
      <Section
        backgroundStyle={{
          backgroundImage: "linear-gradient(10deg, #9b9795, black)",
        }}
      >
        <ResumeContent />
      </Section>
    </div>
    <div id="typingGame">
      <Section
        backgroundStyle={{
          backgroundImage: "linear-gradient(10deg, #9b9795, black)",
        }}
      >
        <TypingGame />
      </Section>
    </div>
    <div id="contact">
      <Section
        backgroundStyle={{
          backgroundImage: "linear-gradient(10deg, #9b9795, black)",
        }}
      >
        <ContactContent />
      </Section>
    </div>
  </React.Fragment>
);
