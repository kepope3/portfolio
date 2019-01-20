import { shallow } from "enzyme";
import App from "../App";
import React from "react";
import Layout from "../Components/Layout";

describe("Name of the group", () => {
  it("should have a layout", () => {
    const comp = shallow(<App />);
    expect(comp.find(Layout)).toHaveLength(1);
  });
});
