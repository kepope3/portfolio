import { shallow } from "enzyme";
import React from "react";
import Body from "../../../Components/Body/Body";
import Section from "../../../Components/Shared/Section";
import AboutContent from "../../../Components/Body/AboutContent";

describe("Body component", () => {
  const comp = shallow(<Body />);
  it("Should have about,resume and contact section", () => {
    expect(comp.find("#about").find(Section)).toHaveLength(1);
    expect(comp.find("#resume").find(Section)).toHaveLength(1);
    expect(comp.find("#contact").find(Section)).toHaveLength(1);
  });
  it("should have about content inside about section", () => {
    expect(comp.find("#about").find(AboutContent)).toHaveLength(1);
  });
});
