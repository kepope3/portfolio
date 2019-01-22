import { shallow } from "enzyme";
import App from "../App";
import React from "react";
import Layout from "../Components/Layout/Layout";
import Body from "../Components/Body/Body";

describe("Name of the group", () => {
  it("should have a layout containing Body", () => {
    const comp = shallow(<App />);
    expect(comp.find(Layout)).toHaveLength(1);
    expect(comp.find(Layout).find(Body)).toHaveLength(1);
  });
});
