import { useMutation, useQuery } from "@vue/apollo-composable";
import gql from "graphql-tag";

const LOGIN = gql`
  query login($req: loginReq!) {
    login(req: $req) {
      id
      name
      phone
      createdAt
    }
  }
`;

const Login = (phone: string) => {
  const { result, loading, error } = useQuery(
    LOGIN,
    {
      req: {
        phone: phone,
      },
    },
    {
      clientId: "default",
    }
  );
  return result;
};

const REGISTER = gql`
  mutation ($req: RegisterReq!) {
    register(req: $req) {
      id
      name
      phone
      createdAt
    }
  }
`;

const Register = async (phone: string, name: string) => {
  const { mutate: register } = useMutation(REGISTER, () => ({
    variables: {
      req: {
        phone: phone,
        name: name,
      },
    },
    clientId: "default",
  }));
  try {
    const response = await register();
    const data = response?.data.register;
    return data;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export { Login, Register };
