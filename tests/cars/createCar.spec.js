import {test,describe, beforeEach, expect} from "@jest/globals";
import { faker } from '@faker-js/faker';
import axios from "axios";
import { wrapper } from 'axios-cookiejar-support';
import { CookieJar } from 'tough-cookie';
import {QAAUTO_API_URL} from "../../src/constants/api.js";
import moment from "moment";

describe.skip("Create car", ()=>{
    const jar = new CookieJar()
    const client = wrapper(axios.create({
        baseURL: QAAUTO_API_URL,
        validateStatus: () => true,
        jar
    }))

    const password = `Qwerty${faker.number.int({min: 100, max: 999})}`
    const userData = {
        "name": faker.person.firstName(),
        "lastName": faker.person.lastName(),
        "email": faker.internet.email(),
        "password": password,
        "repeatPassword": password
    }

    beforeEach(async()=>{
        const signupResponse = await client.post("/api/auth/signup", userData);
        expect(signupResponse.status).toBe(201);

        const signinResponse = await client.post("/api/auth/signin", {
            "email": userData.email,
            "password": userData.password,
            "remember": false
        });
        expect(signinResponse.status).toBe(200);
    })

    test("Should be able to create a Car",async ()=>{
        const carBrandsResponse = await client.get('/api/cars/brands');
        const brand = carBrandsResponse.data.data[0]

        const carModelsResponse = await client.get('/api/cars/models');
        const model = carModelsResponse.data.data.find(model => model.carBrandId === brand.id)

        const requestBody = {
            carBrandId: brand.id,
            carModelId: model.id,
            mileage: faker.number.int({ min: 1, max: 200_000 }),
        }

        const beforeCarCreatedTime = new Date();
        const response = await client.post('/api/cars', requestBody );
        expect(response.status).toBe(201);
        expect(response.data.status).toBe("ok");


        const createdCar = response.data.data;
        const expectedData = {
            "id": expect.any(Number),
            "carBrandId": requestBody.carBrandId,
            "carModelId": requestBody.carModelId,
            "initialMileage": requestBody.mileage,
            "carCreatedAt":  expect.any(String) , //"2021-05-17T15:26:36.000Z",
            "updatedMileageAt":  expect.any(String) , //"2021-05-17T15:26:36.000Z",
            "mileage": requestBody.mileage,
            "brand": brand.title,
            "model": model.title,
            "logo": brand.logoFilename
        }
        expect(createdCar).toEqual(expectedData)

        const carByIdResponse = await client.get(`/api/cars/${createdCar.id}`);
        expect(carByIdResponse.status).toBe(200);
        expect(carByIdResponse.data.data).toEqual(expectedData);

        expect(createdCar.carCreatedAt).toBe(carByIdResponse.data.data.carCreatedAt)
        // expect(createdCar.updatedMileageAt).toBe(carByIdResponse.data.data.updatedMileageAt)

        expect(moment(beforeCarCreatedTime).diff(moment(createdCar.carCreatedAt), "minute")).toBeLessThanOrEqual(1)
        expect(moment(beforeCarCreatedTime).diff(moment(createdCar.updatedMileageAt), "minute")).toBeLessThanOrEqual(1)
    })
})