import { Badge } from "@/components/ui/badge";

interface UserRow {
  id: string;
  name: string | null;
  email: string;
  role: string;
  createdAt: Date;
  _count?: { funeralPlans: number };
}

interface UserTableProps {
  users: UserRow[];
}

export function UserTable({ users }: UserTableProps) {
  if (users.length === 0) {
    return <p className="text-sm text-ink-secondary">No users yet.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-paper-raised">
            <th className="text-left py-3 px-4 font-bold uppercase tracking-wider text-xs text-ink-secondary">Name</th>
            <th className="text-left py-3 px-4 font-bold uppercase tracking-wider text-xs text-ink-secondary">Email</th>
            <th className="text-left py-3 px-4 font-bold uppercase tracking-wider text-xs text-ink-secondary">Role</th>
            <th className="text-left py-3 px-4 font-bold uppercase tracking-wider text-xs text-ink-secondary">Plans</th>
            <th className="text-left py-3 px-4 font-bold uppercase tracking-wider text-xs text-ink-secondary">Joined</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="border-b border-paper-raised last:border-0">
              <td className="py-3 px-4">{user.name || "—"}</td>
              <td className="py-3 px-4">{user.email}</td>
              <td className="py-3 px-4"><Badge variant="secondary">{user.role}</Badge></td>
              <td className="py-3 px-4 font-mono">{user._count?.funeralPlans ?? 0}</td>
              <td className="py-3 px-4 font-mono text-ink-secondary">{new Date(user.createdAt).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
