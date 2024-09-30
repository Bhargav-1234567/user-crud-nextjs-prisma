// pages/register.js
import { useState } from "react";
import { useRouter } from "next/router";
import * as Form from "@radix-ui/react-form";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    // method 2 we can use name and value to update the form data
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleRegister = async (e) => {
    setLoading(true);

    e.preventDefault();

    try {
      await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...formData }),
      });
      router.push("/login");
    } catch (error) {
      setLoading(false);
      setErrorMessage(error.message);
    }
    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white shadow-md rounded">
        <h1 className="text-2xl font-bold mb-6 text-center">Register</h1>
        <Form.Root onSubmit={handleRegister} className="space-y-4">
          {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
          <Form.Field>
            <Form.Label htmlFor="name" className="text-sm font-medium">
              Name
            </Form.Label>
            <Form.Control asChild>
              <input
                type="text"
                id="name"
                name="name"
                className="w-full mt-1 p-2 border border-slate-300 rounded"
                required
                placeholder="Name"
                value={formData.name}
                onChange={handleInputChange}
              />
            </Form.Control>
          </Form.Field>
          <Form.Field>
            <Form.Label htmlFor="email" className="text-sm font-medium">
              Email
            </Form.Label>
            <Form.Control asChild>
              <input
                type="email"
                id="email"
                className="w-full mt-1 p-2 border border-slate-300 rounded"
                required
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleInputChange}
              />
            </Form.Control>
          </Form.Field>
          <Form.Field>
            <Form.Label htmlFor="password" className="text-sm font-medium">
              Password
            </Form.Label>
            <Form.Control asChild>
              <input
                type="password"
                id="password"
                name="password"
                className="w-full mt-1 p-2 border border-slate-300 rounded"
                required
                placeholder="Password"
                value={formData.password}
                onChange={handleInputChange}
              />
            </Form.Control>
          </Form.Field>

          <Form.Submit asChild>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded"
            >
              {loading ? "Logging in..." : "Register"}
            </button>
          </Form.Submit>
        </Form.Root>
      </div>
    </div>
  );
}
