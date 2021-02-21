import { shallow } from "enzyme";
import React from "react";
import Nav from "../../../Components/Layout/Nav";
import List from "../../../Components/Shared/List";
describe("Nav component", () => {
  const comp = shallow(<Nav />);

  it("list should take a list of items and styles", () => {
    const listComp = comp.find(List);
    expect(typeof listComp.prop("list")).toEqual("object");
    expect(listComp.prop("styles")).toEqual({});
  });

  it("should not display home icon when site firt loads", () => {
    const expectedStyle = {
      display: "none",
    };
    expect(comp.find(List).prop("list")[0].props.style).toEqual(expectedStyle);
  });

  it("should not display home icon when at the top of the screen", () => {
    const windowPosition = 0;
    const expectedStyle = {
      display: "none",
    };
    comp.instance().checkWindowHeightAndSetDisplayProp(null, windowPosition);
    comp.update();
    expect(comp.find(List).prop("list")[0].props.style).toEqual(expectedStyle);
  });

  it("should display home icon when not at the top of the screen", () => {
    const windowPosition = 50;
    const expectedStyle = {
      display: "block",
    };
    comp.instance().checkWindowHeightAndSetDisplayProp(null, windowPosition);
    comp.update();
    expect(comp.find(List).prop("list")[0].props.style).toEqual(expectedStyle);
  });
});
