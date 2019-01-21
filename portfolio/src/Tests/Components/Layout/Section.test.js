import { shallow } from "enzyme";
import React from "react";
import Section from "../../../Components/Layout/Section";
describe("Section component", () => {
  const expectedStyle = { background: "" };
  const expectedChildren = <p>hi</p>;
  const comp = shallow(
    <Section backgroundStyle={expectedStyle} children={expectedChildren} />
  );
  it("Should inject background style from props", () => {
    expect(comp.find("#wrapper").prop("style")).toBe(expectedStyle);
  });

  it("should have contaier div wrapping passed in children", () => {
    expect(comp.find(".container").html()).toContain("<p>hi</p>");
  });
});
