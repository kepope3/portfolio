import React from "react";
import Section from "../Shared/Section";
import AboutContent from "./AboutContent";

export default () => (
  <React.Fragment>
    <div id="about">
      <Section
        backgroundStyle={{
          backgroundImage: "linear-gradient(10deg, #887f7f, black)"
        }}
      >
        <AboutContent />
      </Section>
    </div>
    <div id="resume">
      <Section
        backgroundStyle={{
          backgroundImage: "linear-gradient(10deg, #9b9795, black)"
        }}
      >
        <h2>Resume</h2>
        <p>
          The station is one of the most remote in the United Kingdom, at an
          isolated location on the northern edge of Rannoch Moor.[5] The station
          is not accessible by any public roads. The nearest road, the B846 road
          from Loch Rannoch to Rannoch station, is a ten-mile (16 km) walk away
          by hill track,[6] although Rannoch station itself is only 7¼
          route-miles (11.5 km) away by rail.[7] Vehicular access is by a
          15-mile (24km) private road from a little west of Moy Lodge on the
          A86. Until the late 1980s, the only electrical power at the station
          was provided by batteries. The only telephone was the railway's system
          which linked Corrour only to the adjacent signalboxes at Rannoch and
          Tulloch, which were on the public telephone system.[8] At 1,340 ft
          (408 m) above sea level[4] the station provides a starting point for
          hill-walkers and Munro-baggers. There is accommodation and a
          bar/restaurant available at the station[9] and an SYHA youth hostel
          just over a mile (2 km) away at the head of Loch Ossian.[10] The
          station was the starting point of the last journey of the "Man with no
          Name", whose body was found in 1996 on Ben Alder and only identified
          some years later.[11]
        </p>
      </Section>
    </div>
    <div id="contact">
      <Section
        backgroundStyle={{
          backgroundImage: "linear-gradient(8deg, #7a7573, black)"
        }}
      >
        <h2>Contact</h2>
        <p>
          The station is one of the most remote in the United Kingdom, at an
          isolated location on the northern edge of Rannoch Moor.[5] The station
          is not accessible by any public roads. The nearest road, the B846 road
          from Loch Rannoch to Rannoch station, is a ten-mile (16 km) walk away
          by hill track,[6] although Rannoch station itself is only 7¼
          route-miles (11.5 km) away by rail.[7] Vehicular access is by a
          15-mile (24km) private road from a little west of Moy Lodge on the
          A86. Until the late 1980s, the only electrical power at the station
          was provided by batteries. The only telephone was the railway's system
          which linked Corrour only to the adjacent signalboxes at Rannoch and
          Tulloch, which were on the public telephone system.[8] At 1,340 ft
          (408 m) above sea level[4] the station provides a starting point for
          hill-walkers and Munro-baggers. There is accommodation and a
          bar/restaurant available at the station[9] and an SYHA youth hostel
          just over a mile (2 km) away at the head of Loch Ossian.[10] The
          station was the starting point of the last journey of the "Man with no
          Name", whose body was found in 1996 on Ben Alder and only identified
          some years later.[11]
        </p>
      </Section>
    </div>
  </React.Fragment>
);
