import React, { useState, useEffect, useCallback } from "react";
import { Layout } from "../components/Layout";
import { Table } from "../components/Shared/Table";
import { Modal } from "../components/Shared/Modal";
import { Input } from "../components/UI/Input";
import { Button } from "../components/UI/Button";
import { useUser } from "../contexts/UserContext";
import { useToast } from "../contexts/ToastContext";
import { User } from "../types";
import api from "../lib/api";

export const Users: React.FC = () => {
  const { addUser, updateUser, deleteUser } = useUser();
  const { addToast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    role: "",
    password: "",
  });
  const [users, setUsers] = useState<User[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const columns = [
    { key: "firstName", title: "First Name" },
    { key: "lastName", title: "Last Name" },
    { key: "email", title: "Email" },
    { key: "role", title: "Role" },
  ];
  const fetchUsers = useCallback(
    async (page: number = 1, limit: number = 10) => {
      try {
        const res: any = await api.get(`/users?limit=${limit}&page=${page}`);
        console.log("🚀 ~ fetchUsers ~ res:", res);
        if (res.users) {
          setUsers(res.users);
          setTotalPages(res.pagination.totalPages);
          setLimit(res.pagination.itemsPerPage);
          setPage(res.pagination.currentPage);
        }
      } catch (error) {
        console.log("🚀 ~ fetchUsers ~ error:", error);
      }
    },
    []
  );

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone is required";
    }

    if (!formData.role.trim()) {
      newErrors.role = "Role is required";
    }

    return newErrors;
  };

  const resetForm = () => {
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      role: "",
      password: "",
    });
    setErrors({});
    setEditingUser(null);
  };

  const handleAdd = () => {
    setIsModalOpen(true);
    resetForm();
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setFormData({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      role: user.role,
      password: "",
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      deleteUser(id);
      addToast("success", "User deleted successfully");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const userData = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      role: formData.role,
    };

    if (editingUser) {
      const success = updateUser(editingUser.id, userData);
      if (success) {
        addToast("success", "User updated successfully");
        setIsModalOpen(false);
        resetForm();
      } else {
        setErrors({ email: "Email already exists" });
        addToast("error", "Email already exists");
      }
    } else {
      const success = addUser(userData);
      if (success) {
        addToast("success", "User added successfully");
        setIsModalOpen(false);
        resetForm();
      } else {
        setErrors({ email: "Email already exists" });
        addToast("error", "Email already exists");
      }
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    resetForm();
  };
  const handlePageChange = (page: number) => {
    fetchUsers(page, limit);
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Users</h1>
          <p className="text-gray-600">
            Manage system users and their permissions
          </p>
        </div>

        <Table
          columns={columns}
          data={users}
          onAdd={handleAdd}
          onEdit={handleEdit}
          onDelete={handleDelete}
          searchPlaceholder="Search users..."
          addButtonText="Add User"
          loading={loading}
          handlePageChange={handlePageChange}
          page={page}
          totalPages={totalPages}
          limit={limit}
          setLimit={setLimit}
        />

        <Modal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          title={editingUser ? "Edit User" : "Add New User"}
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="First Name"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                required
                error={errors.firstName}
              />

              <Input
                label="Last Name"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                required
                error={errors.lastName}
              />
            </div>

            <Input
              label="Email Address"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              error={errors.email}
            />
            <Input
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleInputChange}
              required
              error={errors.password}
            />

            <Input
              label="Phone Number"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleInputChange}
              required
              error={errors.phone}
            />

            <Input
              label="Role"
              name="role"
              value={formData.role}
              onChange={handleInputChange}
              required
              error={errors.role}
              placeholder="e.g., Admin, Manager, User"
            />

            <div className="flex justify-end space-x-3 pt-4">
              <Button
                type="button"
                variant="secondary"
                onClick={handleCloseModal}
              >
                Cancel
              </Button>
              <Button type="submit" variant="primary">
                {editingUser ? "Update User" : "Add User"}
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </Layout>
  );
};
