"use client";
import { useProblems } from "@/hooks/admin/useProblems";

const AdminProblems = () => {
  const {
    problems,
    categories,
    services,
    newProblem,
    setNewProblem,
    loading,
    error,
    addProblem,
    deleteProblem,
  } = useProblems();

  const handleAddProblem = (e: React.FormEvent) => {
    e.preventDefault();
    addProblem();
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-2 text-primary">Gestion des Problèmes</h1>
      <div className="mb-6 text-sm text-gray-700 bg-primary/10 border-2 border-primary rounded p-3">
        <strong>Les problèmes sont essentiels</strong> pour organiser les services et consultations.<br />
        <span className="text-primary font-semibold">Chaque problème doit être associé à un service et une catégorie.</span> Veuillez d&apos;abord créer les services et catégories nécessaires.
      </div>
      <form onSubmit={handleAddProblem} className="flex flex-col gap-2 mb-6">
        <input
          type="text"
          value={newProblem.name}
          onChange={e => setNewProblem({ ...newProblem, name: e.target.value })}
          placeholder="Nom du problème"
          className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <select
          value={newProblem.category_id}
          onChange={e => setNewProblem({ ...newProblem, category_id: Number(e.target.value) })}
          className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value={0}>Sélectionner une catégorie</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
        <select
          value={newProblem.service_id}
          onChange={e => setNewProblem({ ...newProblem, service_id: Number(e.target.value) })}
          className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value={0}>Sélectionner un service</option>
          {services.map(srv => (
            <option key={srv.id} value={srv.id}>{srv.name}</option>
          ))}
        </select>
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
        {problems.map(prob => (
          <li key={prob.id} className="flex items-center justify-between px-4 py-3">
            <span className="font-medium text-gray-800">
              {prob.name} <span className="text-xs text-gray-500">({categories.find(c => c.id === prob.category_id)?.name} / {services.find(s => s.id === prob.service_id)?.name})</span>
            </span>
            <button
              onClick={() => deleteProblem(prob.id)}
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

export default AdminProblems; 