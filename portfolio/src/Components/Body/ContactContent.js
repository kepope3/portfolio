import React from "react";
export default () => (
  <React.Fragment>
    <div className="row">
      <div className="col-1 offset-1">
        <h3>
          <i className="fas fa-map-pin" />
        </h3>
      </div>
      <div className="col-8 text-center">
        <strong>
          <p>Newquay, Cornwall</p>
        </strong>
      </div>
    </div>
    <div className="row">
      <div className="col-1 offset-1">
        <h3>
          <i className="fas fa-phone-volume" />
        </h3>
      </div>
      <div className="col-8 text-center">
        <p>+44 757 095 9444</p>
      </div>
    </div>
    <div className="row">
      <div className="col-1 offset-1">
        <h3>
          <i className="fas fa-at" />
        </h3>
      </div>
      <div className="col-8 text-center">
        <p>
          <a href="mailto:pope_446@hotmail.com">Keith Pope</a>
        </p>
      </div>
    </div>
  </React.Fragment>
);
