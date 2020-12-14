import { add, divide, concat } from './units';

import { expect } from 'chai';
import 'mocha';
import {it} from "mocha";

describe('add function', () => {

  it('should add two and two', () => {
    const result = add(2,2);
    expect(result).to.equal(4);
  });

  it('should add -2 and two', () => {
    const result = add(-2,2);
    expect(result).to.equal(0);
  });

});

describe('divide', () => {

  it('should divide 6 by 3', () => {
    const result = divide(6,3);
    expect(result).to.equal(2);
  });

  it('should divide 5 and 2', () => {
    const result = divide(5,2);
    expect(result).to.equal(2.5);
  });

  it('should throw an error if div by zero', () => {
    expect(()=>{ divide(5,0) }).to.throw('div by 0')
  });

});

// @TODO try creating a new describe block for the "concat" method
// it should contain an it block for each it statement in the units.ts @TODO.
// don't forget to import the method ;)
describe('concat function', () => {

    it("should be throw an error if either a or b is empty string", () => {
        const tests: { a: string, b:string }[] = [
            { a: "", b: "a" },
            { a: "a", b: "" },
            { a: "", b: "" },
        ]

        for (const test of tests) {
            expect(()=>{ concat(test.a,test.b) }).to.throw("a or b can't be empty");
        }
    });

    it('should concat two strings that are not empty', () => {
        const tests: { a: string, b:string, expected: string }[] = [
            { a: "jhon", b: "Emmanuel", expected: "jhonEmmanuel" },
            { a: "torres", b: "Toloza", expected: "torresToloza" },
            { a: "FirstName", b: "MiddleName", expected: "FirstNameMiddleName"  },
        ]

        tests.forEach(test => {
            expect(concat(test.a, test.b)).to.equal(test.expected);
        });
    });
});