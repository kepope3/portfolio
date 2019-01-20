import { shallow } from "enzyme";
import React from "react";
import Banner from "../../../Components/Layout/Banner";
describe("Banner component", () => {
  it("Should have background image", () => {
    const comp = shallow(<Banner />);
    expect(comp.find("#backgroundImage")).toHaveLength(1);
  });
});
