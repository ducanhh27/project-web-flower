import axios from "axios"

const token="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2N2JlNmE2MmJjZjkyMjE0NmY0Yzk0NDMiLCJpYXQiOjE3NDA1MzYyNzMsImV4cCI6MTc0OTE3NjI3M30.rgHsmT2GSB4koWGgM_mhc_W89ZzEAtwfs1_0tvhkjws"
const url = "http://localhost:3000/products"

const ApiService ={
    ApiListProduct: async () =>{
        return await axios.get(url,{
            headers: {
                'Authorization': `Bearer ${token}`, // Chèn JWT token vào đây
              },
        }); 
    }
};
export default ApiService