import { shallow } from "enzyme";
import React from "react";
import Body from "../../../Components/Body/Body";
import Section from "../../../Components/Shared/Section";
import AboutContent from "../../../Components/Body/AboutContent";
import ResumeContent from "../../../Components/Body/ResumeContent";
import ContactContent from "../../../Components/Body/ContactContent";

describe("Body component", () => {
  const comp = shallow(<Body />);
  it("Should have about,resume and contact section", () => {
    expect(comp.find("#about").find(Section)).toHaveLength(1);
    expect(comp.find("#resume").find(Section)).toHaveLength(1);
    expect(comp.find("#contact").find(Section)).toHaveLength(1);
    expect(comp.find("#typingGame")).toHaveLength(1);
  });
  it("should have about content inside about section", () => {
    expect(comp.find("#about").find(AboutContent)).toHaveLength(1);
  });

  it("should have resume content inside resume section", () => {
    expect(comp.find("#resume").find(ResumeContent)).toHaveLength(1);
  });

  it("should have contact content inside contact section", () => {
    expect(comp.find("#contact").find(ContactContent)).toHaveLength(1);
  });
});
