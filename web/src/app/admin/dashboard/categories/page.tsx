"use client";
import { useEffect, useState } from "react";
import { useCategories } from "@/hooks/admin/useCategories";

const AdminCategories = () => {
  const [newCategory, setNewCategory] = useState("");
  const { categories, loading, error, fetchCategories, addCategory, deleteCategory, setError } = useCategories();

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategory.trim()) return;
    await addCategory(newCategory);
    setNewCategory("");
  };

  const handleDeleteCategory = async (id: number) => {
    await deleteCategory(id);
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-2 text-primary">Gestion des Catégories</h1>
      <div className="mb-6 text-sm text-gray-700 bg-primary/10 border-2 border-primary rounded p-3">
        <strong>Les catégories sont essentielles</strong> pour organiser les <span className="text-primary font-semibold">blogs</span> et les <span className="text-primary font-semibold">problèmes</span> dans la plateforme. Veillez à bien les gérer pour une meilleure classification et recherche.
      </div>
      <form onSubmit={handleAddCategory} className="flex gap-2 mb-6">
        <input
          type="text"
          value={newCategory}
          onChange={e => { setNewCategory(e.target.value); setError(null); }}
          placeholder="Nouvelle catégorie"
          className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <button
          type="submit"
          className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/90"
          disabled={loading}
        >
          Ajouter
        </button>
      </form>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      {loading && <div className="text-gray-500 mb-4">Chargement...</div>}
      <ul className="divide-y divide-gray-200 bg-white rounded shadow">
        {categories.map(cat => (
          <li key={cat.id} className="flex items-center justify-between px-4 py-3">
            <span className="font-medium text-gray-800">{cat.name}</span>
            <button
              onClick={() => handleDeleteCategory(cat.id)}
              className="text-red-500 hover:text-red-700 px-2 py-1 rounded border border-red-200 hover:bg-red-50"
              disabled={loading}
            >
              Supprimer
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminCategories; 