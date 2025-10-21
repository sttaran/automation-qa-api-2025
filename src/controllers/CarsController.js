import BaseController from "./BaseController.js";


export default class CarsController extends BaseController {

    getBrands(){
        return this.client.get('/api/cars/brands');
    }

    getModels(){
        return this.client.get('/api/cars/models');
    }

    createCar(carData){
        return this.client.post('/api/cars', carData );
    }

    getCarById(id){
        return this.client.get(`/api/cars/${id}`);
    }
}