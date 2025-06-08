import { useAuthStore } from "../../stores/auth.store";

export function Dashboard() {
  const { user } = useAuthStore();
  console.log(user);

  return <div>Dashboard</div>;
}
