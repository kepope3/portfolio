import { shallow } from "enzyme";
import React from "react";
import Body from "../../Components/Body";
import Section from "../../Components/Shared/Section";

describe("Body component", () => {
  it("Should have about,portfolio and contact section", () => {
    const comp = shallow(<Body />);
    expect(comp.find("#about").find(Section)).toHaveLength(1);
    expect(comp.find("#portfolio").find(Section)).toHaveLength(1);
    expect(comp.find("#contact").find(Section)).toHaveLength(1);
  });
});
