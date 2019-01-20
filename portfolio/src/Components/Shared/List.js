import React from "react";
export default ({ list, styles }) => {
  const listStyles = styles ? styles.list : null;
  return (
    <React.Fragment>
      <ul className={listStyles}>
        {list.map((item, key) => (
          <li key={key} id={"li" + key}>
            {item}
          </li>
        ))}
      </ul>
    </React.Fragment>
  );
};
