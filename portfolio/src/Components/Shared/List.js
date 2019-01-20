import React from "react";
export default ({ list }) => {
  return (
    <React.Fragment>
      <ul>
        {list.map((item, key) => (
          <li id={"li" + key}>{item}</li>
        ))}
      </ul>
    </React.Fragment>
  );
};
