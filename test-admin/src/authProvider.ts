import { AuthProvider } from "react-admin";
export const authProv: AuthProvider ={
    login:({username,password})=>{
        localStorage.setItem("username",username);
        localStorage.setItem("password",password);
        if(username==="Imanol"&& password==="HOLA"){
        return Promise.resolve();
        }
        return Promise.reject();

    },

    logout: ()=>{
        localStorage.removeItem("username")
        return Promise.resolve()
    },

    checkError: ({ status }: { status: number }) => {
        if(status===401||status===403){
            localStorage.removeItem("username");
            return Promise.reject();
        }
        return Promise.resolve();
    },

    checkAuth: ()=>{
        return localStorage.getItem("username")
        ?Promise.resolve()
        : Promise.reject()
    },

    getPermissions: () => Promise.resolve(),
    


};
