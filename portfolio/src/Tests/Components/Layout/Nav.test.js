import { shallow } from "enzyme";
import React from "react";
import Nav from "../../../Components/Layout/Nav";
import List from "../../../Components/Shared/List";
describe("Nav component", () => {
  const comp = shallow(<Nav />);

  it("Should have List", () => {
    expect(comp.find(List)).toHaveLength(1);
  });
  it("list should take a list of items and styles", () => {
    const expectedList = ["home", "about"];

    const listComp = comp.find(List);
    expect(listComp.prop("list")).toEqual(expectedList);
    expect(listComp.prop("styles")).toEqual({});
  });
});
