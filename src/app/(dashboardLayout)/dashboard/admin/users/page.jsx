"use client";

import { useEffect, useState } from "react";
import {
  Person,
  Persons,
  CircleCheckFill,
  CircleXmarkFill,
  PersonPlus,
  Wallet,
  TrashBin,
} from "@gravity-ui/icons";
import Swal from "sweetalert2";
import Image from "next/image";
import { getUserToken } from "@/lib/core/session";

export default function ManageUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  // ==================== LOAD USERS ====================

  useEffect(() => {
    let cancelled = false;
    

    const loadUsers = async () => {
      try {
        const token = await getUserToken();

        if (!token) {
          throw new Error("Missing auth token.");
        }

        const response = await fetch(
          "http://localhost:5000/api/admin/users",
          {
            cache: "no-store",
            headers: {
              "content-type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(
            data.message || "Failed to load users."
          );
        }

        if (!cancelled) {
          setUsers(data.users || []);
        }
      } catch (error) {
        console.error("Admin users error:", error);

        if (!cancelled) {
          Swal.fire({
            icon: "error",
            title: "Failed to load users",
            text:
              error.message ||
              "Unable to load users.",
            background: "#0f172a",
            color: "#fff",
            confirmButtonColor: "#8b5cf6",
          });
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadUsers();

    return () => {
      cancelled = true;
    };
  }, []);

  // ==================== UPDATE ROLE ====================

  const handleRoleChange = async (user, newRole) => {
    if (user.role === newRole) return;

    const result = await Swal.fire({
      title: "Change User Role?",
      text: `Change ${user.name || user.email}'s role to ${newRole}?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, Change Role",
      cancelButtonText: "Cancel",
      background: "#0f172a",
      color: "#fff",
      confirmButtonColor: "#8b5cf6",
      cancelButtonColor: "#475569",
    });

    if (!result.isConfirmed) {
      return;
    }

    try {
      setActionLoading(user._id);

      const token = await getUserToken();

      if (!token) {
        throw new Error("Missing auth token.");
      }

      const response = await fetch(
        `http://localhost:5000/api/admin/users/${user._id}/role`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ role: newRole }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
            "Failed to update user role."
        );
      }

      setUsers((previous) =>
        previous.map((item) =>
          item._id === user._id
            ? {
                ...item,
                role: newRole,
              }
            : item
        )
      );

      Swal.fire({
        icon: "success",
        title: "Role Updated",
        text: `${user.name || user.email} is now a ${newRole}.`,
        background: "#0f172a",
        color: "#fff",
        confirmButtonColor: "#8b5cf6",
      });
    } catch (error) {
      console.error("Role update error:", error);

      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text:
          error.message ||
          "Unable to update user role.",
        background: "#0f172a",
        color: "#fff",
        confirmButtonColor: "#8b5cf6",
      });
    } finally {
      setActionLoading(null);
    }
  };

  // ==================== DELETE USER ====================

  const handleDelete = async (user) => {
    const result = await Swal.fire({
      title: "Delete User?",
      text: `This will permanently delete ${user.name || user.email}. This action cannot be undone.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Delete",
      cancelButtonText: "Cancel",
      background: "#0f172a",
      color: "#fff",
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#475569",
    });

    if (!result.isConfirmed) {
      return;
    }

    try {
      setActionLoading(user._id);

      const token = await getUserToken();
      // console.log(token);

      if (!token) {
        throw new Error("Missing auth token.");
      }

      const response = await fetch(
        `http://localhost:5000/api/admin/users/${user._id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Failed to delete user."
        );
      }

      setUsers((previous) =>
        previous.filter(
          (item) => item._id !== user._id
        )
      );

      Swal.fire({
        icon: "success",
        title: "User Deleted",
        text: "The user has been removed successfully.",
        background: "#0f172a",
        color: "#fff",
        confirmButtonColor: "#8b5cf6",
      });
    } catch (error) {
      console.error("Delete user error:", error);

      Swal.fire({
        icon: "error",
        title: "Delete Failed",
        text:
          error.message ||
          "Unable to delete user.",
        background: "#0f172a",
        color: "#fff",
        confirmButtonColor: "#8b5cf6",
      });
    } finally {
      setActionLoading(null);
    }
  };

  // ==================== LOADING ====================

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 p-6 text-white md:p-8">
        <div className="flex min-h-[400px] items-center justify-center">
          <div className="text-center">
            <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-2 border-slate-700 border-t-violet-500" />

            <p className="text-sm text-slate-400">
              Loading users...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ==================== STATISTICS ====================

  const totalAdmins = users.filter(
    (user) => user.role === "Admin"
  ).length;

  const totalCreators = users.filter(
    (user) => user.role === "Creator"
  ).length;

  const totalSupporters = users.filter(
    (user) => user.role === "Supporter"
  ).length;

  // ==================== PAGE ====================

  return (
    <div className="min-h-screen bg-slate-950 p-6 text-white md:p-8">
      {/* Header */}

      <div className="mb-8">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-violet-500/10 p-3">
            <Persons className="h-6 w-6 text-violet-400" />
          </div>

          <div>
            <h1 className="text-2xl font-bold">
              Manage Users
            </h1>

            <p className="mt-1 text-sm text-slate-400">
              Manage Fundora users, roles, and available credits
            </p>
          </div>
        </div>
      </div>

      {/* Summary */}

      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Users */}

        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">
                Total Users
              </p>

              <p className="mt-1 text-3xl font-bold">
                {users.length}
              </p>
            </div>

            <div className="rounded-xl bg-violet-500/10 p-3">
              <Persons className="h-6 w-6 text-violet-400" />
            </div>
          </div>
        </div>

        {/* Supporters */}

        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">
                Supporters
              </p>

              <p className="mt-1 text-3xl font-bold">
                {totalSupporters}
              </p>
            </div>

            <div className="rounded-xl bg-blue-500/10 p-3">
              <Person className="h-6 w-6 text-blue-400" />
            </div>
          </div>
        </div>

        {/* Creators */}

        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">
                Creators
              </p>

              <p className="mt-1 text-3xl font-bold">
                {totalCreators}
              </p>
            </div>

            <div className="rounded-xl bg-pink-500/10 p-3">
              <PersonPlus className="h-6 w-6 text-pink-400" />
            </div>
          </div>
        </div>

        {/* Admins */}

        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">
                Admins
              </p>

              <p className="mt-1 text-3xl font-bold">
                {totalAdmins}
              </p>
            </div>

            <div className="rounded-xl bg-emerald-500/10 p-3">
              <CircleCheckFill className="h-6 w-6 text-emerald-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Users Table */}

      {users.length === 0 ? (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-12 text-center">
          <div className="mx-auto mb-4 w-fit rounded-full bg-violet-500/10 p-4">
            <Persons className="h-8 w-8 text-violet-400" />
          </div>

          <h2 className="text-lg font-semibold">
            No Users Found
          </h2>

          <p className="mt-2 text-sm text-slate-400">
            There are currently no users in Fundora.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/70">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[950px]">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-900">
                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                    User
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Email
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Role
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Credits
                  </th>

                  <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {users.map((user) => {
                  const isProcessing =
                    actionLoading === user._id;

                  const name =
                    user.name || "Unnamed User";

                  const email =
                    user.email || "No email";

                  const photo = user.photo || "";

                  return (
                    <tr
                      key={user._id}
                      className="border-b border-slate-800/70 transition hover:bg-slate-800/30"
                    >
                      {/* User */}

                      <td className="px-5 py-5">
                        <div className="flex items-center gap-3">
                          <div className="h-11 w-11 shrink-0 overflow-hidden rounded-full border border-violet-500/30 bg-slate-800">
                            {photo ? (
                              <Image
      src={photo}
      alt={name}
      width={44}
      height={44}
      className="h-full w-full object-cover"
    />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center">
                                <Person className="h-5 w-5 text-slate-500" />
                              </div>
                            )}
                          </div>

                          <div>
                            <p className="font-medium text-white">
                              {name}
                            </p>

                            <p className="text-xs text-slate-500">
                              {user.role || "Supporter"}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Email */}

                      <td className="px-5 py-5">
                        <p className="text-sm text-slate-300">
                          {email}
                        </p>
                      </td>

                      {/* Role */}

                      <td className="px-5 py-5">
                        <select
                          value={user.role || "Supporter"}
                          disabled={isProcessing}
                          onChange={(event) =>
                            handleRoleChange(
                              user,
                              event.target.value
                            )
                          }
                          className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white outline-none transition focus:border-violet-500"
                        >
                          <option value="Admin">
                            Admin
                          </option>

                          <option value="Creator">
                            Creator
                          </option>

                          <option value="Supporter">
                            Supporter
                          </option>
                        </select>
                      </td>

                      {/* Credits */}

                      <td className="px-5 py-5">
                        <div className="flex items-center gap-2">
                          <Wallet className="h-4 w-4 text-violet-400" />

                          <span className="font-semibold text-white">
                            {Number(
                              user.credits || 0
                            ).toLocaleString()}
                          </span>
                        </div>
                      </td>

                      {/* Actions */}

                      <td className="px-5 py-5">
                        <div className="flex justify-end">
                          <button
                            type="button"
                            disabled={isProcessing}
                            onClick={() =>
                              handleDelete(user)
                            }
                            className="flex items-center gap-2 rounded-lg bg-red-500/10 px-3 py-2 text-sm font-medium text-red-400 transition hover:bg-red-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            <TrashBin className="h-4 w-4" />

                            {isProcessing
                              ? "Processing..."
                              : "Remove"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}