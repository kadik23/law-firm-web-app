type SignupformType ={
    stepOne:{
        name: string;
        surname: string;
        email: string;
        password: string;
        conpassword: string;
    }
    stepTwo:{
        nbr_tel:string;
        pays: string;
        ville: string;
        age:string;
        gender: string
    }
    stepThree?: {
        files: unknown[]
    }
}

type SigninformType = {
    email:string
    password: string
}


interface AuthContextType {
  user: User | null;
  loading: boolean;
}