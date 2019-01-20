import { shallow } from "enzyme";
import React from "react";
import Banner from "../../../Components/Layout/Banner";
describe("Banner component", () => {
  it("Should have background image", () => {
    const comp = shallow(<Banner />);
    expect(comp.find("#backgroundImage")).toHaveLength(1);
  });

  it("Should inject image src from props", () => {
    const expectedSrc = "/sds/sds";
    const comp = shallow(<Banner imgSrc={expectedSrc} />);
    expect(comp.find("#backgroundImage").prop("src")).toBe(expectedSrc);
  });
});
