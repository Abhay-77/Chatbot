import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { Link } from "react-router-dom";

const Login = () => {
  return (
    <main className="h-screen w-screen flex items-center justify-center bg-neutral-200">
      <form
        action="http://localhost:3000/login"
        method="post"
        className="bg-white p-6 rounded-lg sm:w-[90%] md:w-[40%] lg:w-[35%] xl:w-[30%] border border-gray-300 flex flex-col gap-4"
      >
        <h1 className="font-bold text-3xl">Login</h1>
        <div className="">
          <h2 className="">Username</h2>
          <Input
            placeholder="Username"
            name="username"
            className="border-gray-500"
            required
          />
        </div>
        <div className="">
          <h2 className="">Password</h2>
          <Input
            placeholder="Password"
            name="password"
            type="password"
            className="border-gray-500"
            required
          />
        </div>
        <Button type="submit" className="bg-gray-600 hover:bg-gray-800">
          Login
        </Button>
        <h3 className="">
          Don't have an account?Create one{" "}
          <Link to={"/signup"} className="text-blue-500 underline">
            Sign up
          </Link>
        </h3>
      </form>
    </main>
  );
};

export default Login;
