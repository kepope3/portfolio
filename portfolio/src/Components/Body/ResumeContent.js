import React from "react";
import List from "../Shared/List";
import styles from "./../../Assets/CSS/Body/ResumeContent.module.css";

export default () => (
  <div className="row">
    <div className="col-md-4">
      <h2>Résumé</h2>
      <h3>Skills and experience.</h3>
    </div>
    <div className="col-md-8">
      <List
        styles={styles}
        list={[
          "First class degree in Computing",
          "Over Eight years industry experience",
          ".NET / C# / JavaScript / TypeScript / Java",
          "React / HTML / CSS / SQL",
          "TDD / Pair programming",
          "Cloud Services / Devops",
          <a
            href="https://github.com/kepope3/portfolio"
            target="_blank"
            rel="noopener noreferrer"
          >
            View website source code <i className="fab fa-github" />
          </a>,
        ]}
      />
    </div>
  </div>
);
