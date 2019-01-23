import { mount } from "enzyme";
import React from "react";
import Nav from "../../../Components/Layout/Nav";
import List from "../../../Components/Shared/List";
describe("Nav component", () => {
  const comp = mount(<Nav />);

  it("list should take a list of items and styles", () => {
    const listComp = comp.find(List);
    expect(typeof listComp.prop("list")).toEqual("object");
    expect(listComp.prop("styles")).toEqual({});
  });

  it("should not display home icon if at top of screen", () => {
    const windowPosition = 0;
    const expectedStyle = {
      display: "none"
    };
    comp.instance().checkWindowHeightAndSetDisplayProp(null, windowPosition);
    comp.update();
    expect(comp.find(List).prop("list")[0].props.style).toEqual(expectedStyle);
  });

  it("should display home icon not at top of screen", () => {
    const windowPosition = 50;
    const expectedStyle = {
      display: "block"
    };
    comp.instance().checkWindowHeightAndSetDisplayProp(null, windowPosition);
    comp.update();
    expect(comp.find(List).prop("list")[0].props.style).toEqual(expectedStyle);
  });
});
