import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, Users, Loader2, Shield } from "lucide-react";
import { getUsers, deleteUser } from "../../backend/database";

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await getUsers();
      setUsers(res.documents);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, name, role) => {
    if (role === 'ADMIN') {
        alert("Cannot delete an Administrator account.");
        return;
    }
    
    if (window.confirm(`Are you sure you want to delete user ${name || 'Unknown'}? This cannot be undone.`)) {
      try {
        await deleteUser(id);
        fetchUsers();
      } catch (error) {
        console.error("Error deleting user", error);
        alert("Failed to delete user.");
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <Users className="w-8 h-8 text-primary" />
            User Management
          </h1>
          <p className="text-muted-foreground mt-1">
            View and manage all registered users on the platform.
          </p>
        </div>
      </div>

      <Card className="border-border shadow-sm">
        <CardHeader className="bg-secondary/20 border-b border-border">
          <CardTitle className="text-lg font-medium flex items-center gap-2">
            Registered Users
            <span className="bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full">
              {users.length} Total
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex justify-center items-center py-20 text-muted-foreground">
              <Loader2 className="w-8 h-8 animate-spin" />
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground">
              No users found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-muted-foreground uppercase bg-secondary/50 border-b border-border">
                  <tr>
                    <th className="px-6 py-4 font-medium">Name</th>
                    <th className="px-6 py-4 font-medium">Email</th>
                    <th className="px-6 py-4 font-medium">Role</th>
                    <th className="px-6 py-4 font-medium">Joined</th>
                    <th className="px-6 py-4 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {users.map((user) => (
                    <tr key={user.$id} className="hover:bg-secondary/20 transition-colors">
                      <td className="px-6 py-4 font-medium text-foreground">
                        {user.name || 'Anonymous User'}
                      </td>
                      <td className="px-6 py-4 text-muted-foreground">
                        {user.email}
                      </td>
                      <td className="px-6 py-4">
                        {user.role === 'ADMIN' ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                            <Shield className="w-3 h-3" /> Admin
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
                            Customer
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-muted-foreground">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/50 transition-colors"
                          onClick={() => handleDelete(user.$id, user.name, user.role)}
                          disabled={user.role === 'ADMIN'}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
