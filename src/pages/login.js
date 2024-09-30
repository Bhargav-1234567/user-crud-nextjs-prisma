import { useState } from "react";
import { signIn } from "next-auth/react";
import * as Form from "@radix-ui/react-form";
import { useRouter } from "next/router";

export default function Login() {
  const router = useRouter();
  const { error } = router.query;
  // method 2 we can use different states for each fields

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    setLoading(false);
    if (!result.error) {
      router.push("/");
    } else {
      router.push(`/login?error=${result.error}`);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white shadow-md rounded">
        <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>
        {error && <p className="text-red-500 text-center">{error}</p>}

        <Form.Root onSubmit={handleSubmit} className="space-y-4">
          <Form.Field>
            <Form.Label htmlFor="email" className="text-sm font-medium">
              Email
            </Form.Label>
            <Form.Control asChild>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full mt-1 p-2 border border-slate-300 rounded"
                required
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full mt-1 p-2 border border-gray-300 rounded"
                required
              />
            </Form.Control>
          </Form.Field>
          <Form.Submit asChild>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </Form.Submit>
        </Form.Root>
      </div>
    </div>
  );
}
