import React, { useState } from "react";
import { Layout } from "../components/Layout";
import { Table } from "../components/Shared/Table";
import { Modal } from "../components/Shared/Modal";
import { Input } from "../components/UI/Input";
import { Button } from "../components/UI/Button";
import { useUser } from "../contexts/UserContext";
import { useToast } from "../contexts/ToastContext";
import { User } from "../types";

export const Users: React.FC = () => {
  const { users, addUser, updateUser, deleteUser } = useUser();
  const { addToast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const columns = [
    { key: "name", title: "Name" },
    { key: "email", title: "Email" },
    { key: "createdAt", title: "Created At" },
    { key: "updatedAt", title: "Updated At" },
  ];

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

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    return newErrors;
  };

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
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
      name: user.name,
      email: user.email,
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
      name: formData.name,
      email: formData.email,
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
        />

        <Modal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          title={editingUser ? "Edit User" : "Add New User"}
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Full Name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              error={errors.name}
            />

            <Input
              label="Email Address"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              error={errors.email}
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
