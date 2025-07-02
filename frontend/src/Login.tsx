import { useState, type FormEvent } from "react";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { Link } from "react-router-dom";

const Login = () => {
  const [error, setError] = useState("");
  async function handleLogin(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const username = formData.get("username");
    const password = formData.get("password");

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message);
      } else {
        window.location.href = "/";
      }
    } catch (e) {
      console.error(e);
      setError("Unable to login.Try again!");
    }
  }
  return (
    <main className="h-screen w-screen flex items-center justify-center bg-neutral-200">
      <form
        onSubmit={handleLogin}
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
        {error && <div className="text-red-600 text-lg">{error}</div>}
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
