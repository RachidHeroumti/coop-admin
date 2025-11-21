import React, { useState, useEffect, useCallback } from "react";
import { Layout } from "../components/Layout";
import { Table } from "../components/Shared/Table";
import { Modal } from "../components/Shared/Modal";
import { Input } from "../components/UI/Input";
import { TextArea } from "../components/UI/TextArea";
import { Button } from "../components/UI/Button";
import { useCooperative } from "../hooks/useCooperative";
import { useToast } from "../contexts/ToastContext";
import { Cooperative } from "../types";

export const Cooperatives: React.FC = () => {
  const {
    addCooperative,
    updateCooperative,
    deleteCooperative,
    fetchCooperatives,
  } = useCooperative();
  const { addToast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCooperative, setEditingCooperative] =
    useState<Cooperative | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    founded: "",
    founder: "",
    phone: "",
    address: "",
    score: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [cooperatives, setCooperatives] = useState<Cooperative[]>([]);
  const [loading, setLoading] = useState(false);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const columns = [
    { key: "name", title: "Name" },
    { key: "founder", title: "Founder" },
    { key: "phone", title: "Phone" },
    {
      key: "founded",
      title: "Founded",
      render: (value: Date) => new Date(value).toLocaleDateString("en-US"),
    },
  ];


  const loadCooperatives = useCallback(
    async (page: number = 1, limit: number = 10) => {
      setLoading(true);
      try {
        const { cooperatives: data, pagination } = await fetchCooperatives(
          page,
          limit
        );
        console.log("🚀 ~ loadCooperatives ~ data:", data);
        setCooperatives(data);
        setTotalPages(pagination.totalPages || 0);
        setLimit(pagination.itemsPerPage || 10);
        setPage(pagination.currentPage || 1);
      } catch (error) {
        console.log("🚀 ~ loadCooperatives ~ error:", error);
        addToast("error", "Failed to load cooperatives");
      } finally {
        setLoading(false);
      }
    },
    [fetchCooperatives, addToast]
  );

  useEffect(() => {
    loadCooperatives();
  }, [loadCooperatives]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
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

    if (!formData.founder.trim()) {
      newErrors.founder = "Founder is required";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone is required";
    }

    if (!formData.address.trim()) {
      newErrors.address = "Address is required";
    }

    if (!formData.founded) {
      newErrors.founded = "Founded date is required";
    }

    if (!formData.score.trim()) {
      newErrors.score = "Score is required";
    }

    return newErrors;
  };

  const resetForm = () => {
    setFormData({
      name: "",
      founded: "",
      founder: "",
      phone: "",
      address: "",
      score: "",
    });
    setErrors({});
    setEditingCooperative(null);
  };

  const handleAdd = () => {
    setIsModalOpen(true);
    resetForm();
  };

  const handleEdit = (cooperative: Cooperative) => {
    setEditingCooperative(cooperative);
    setFormData({
      name: cooperative.name,
      founded: cooperative.founded.toISOString().split("T")[0],
      founder: cooperative.founder,
      phone: cooperative.phone,
      address: cooperative.address,
      score: cooperative.score,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this cooperative?")) {
      await deleteCooperative(id);
      addToast("success", "Cooperative deleted successfully");
      loadCooperatives(page, limit);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const cooperativeData = {
      name: formData.name,
      founded: new Date(formData.founded),
      founder: formData.founder,
      phone: formData.phone,
      address: formData.address,
      score: formData.score,
    };

    if (editingCooperative) {
      const success = await updateCooperative(
        editingCooperative.id,
        cooperativeData
      );
      if (success) {
        addToast("success", "Cooperative updated successfully");
        setIsModalOpen(false);
        resetForm();
        loadCooperatives(page, limit);
      }
    } else {
      const success = await addCooperative(cooperativeData);
      if (success) {
        addToast("success", "Cooperative added successfully");
        setIsModalOpen(false);
        resetForm();
        loadCooperatives(page, limit);
      }
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    resetForm();
  };

  const handlePageChange = (newPage: number) => {
    loadCooperatives(newPage, limit);
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Cooperatives</h1>
          <p className="text-gray-600">
            Manage cooperatives and their information
          </p>
        </div>

        <Table
          columns={columns}
          data={cooperatives}
          onAdd={handleAdd}
          onEdit={handleEdit}
          onDelete={handleDelete}
          searchPlaceholder="Search cooperatives..."
          addButtonText="Add Cooperative"
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
          title={
            editingCooperative ? "Edit Cooperative" : "Add New Cooperative"
          }
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Cooperative Name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              error={errors.name}
            />

            <Input
              label="Founder"
              name="founder"
              value={formData.founder}
              onChange={handleInputChange}
              required
              error={errors.founder}
            />

            <Input
              label="Phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleInputChange}
              required
              error={errors.phone}
            />

            <Input
              label="Founded Date"
              name="founded"
              type="text"
              value={formData.founded}
              onChange={handleInputChange}
              required
              error={errors.founded}
              placeholder="YYYY-MM-DD"
            />

            <Input
              label="Score"
              name="score"
              value={formData.score}
              onChange={handleInputChange}
              required
              error={errors.score}
            />

            <TextArea
              label="Address"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              required
              error={errors.address}
              rows={3}
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
                {editingCooperative ? "Update Cooperative" : "Add Cooperative"}
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </Layout>
  );
};
