import {test,describe, beforeEach,afterEach, afterAll, beforeAll} from "@jest/globals";


describe("test describe", ()=>{
    // once before all tests
    beforeAll(()=>{
        console.log("BEFORE ALL")
    })

    // before each test
    beforeEach(()=>{
        console.log("BEFORE EACH")
    })

    test("test 1", async ()=>{
        console.log("test 1");
    })

    test("test 2", async ()=>{
        console.log("test 2");
    })

    // after each test
    afterEach(()=>{
        console.log("AFTER EACH")
    })

    // once after all tests
    afterAll(()=>{
        console.log("AFTER ALL")
    })



})