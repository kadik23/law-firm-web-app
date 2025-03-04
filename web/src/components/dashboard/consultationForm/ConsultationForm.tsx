import { useState } from "react";
import TextInput from "./textInput";
import SelectInput from "./SelectInput";
import DateTimeInput from "./DateTimeInput";
import RadioGroup from "./RadioGroup";

const ConsultationForm: React.FC = () => {
  const [formData, setFormData] = useState({
    subject: "",
    problem: "",
    description: "",
    date: "",
    time: "",
    mode: "en-ligne",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form Data Submitted:", formData);
  };

  return (
    <div className="p-6 text-white">
      <h2 className="text-xl font-semibold mb-6">
        Veuillez remplir ce formulaire pour réserver <br />
        une consultation gratuite !
      </h2>

      <form onSubmit={handleSubmit}>
        <div className="flex gap-3 py-2 items-center h-16">
          <TextInput label="Sujet de consultation" name="subject" value={formData.subject} onChange={handleChange} placeholder="Entrez le sujet" />
          <SelectInput
            label="Sélection du problème"
            name="problem"
            value={formData.problem}
            onChange={handleChange}
            options={[
              { label: "Sélectionner...", value: "" },
              { label: "Problème 1", value: "probleme1" },
              { label: "Problème 2", value: "probleme2" },
            ]}
          />
        </div>

        <div className="mt-4">
            <TextInput label="Description du problème" name="description" value={formData.description} onChange={handleChange} placeholder="Décrivez votre problème..." />
        </div>

        <div className="flex gap-3 py-2 items-center w-full h-16 mt-4">
          <DateTimeInput 
            label="Choisir une date" 
            name="date" type="date" 
            value={formData.date} 
            onChange={handleChange} 
            icon="mdi:calendar" />
          <DateTimeInput label="Choisir une heure" name="time" type="time" value={formData.time} onChange={handleChange} icon="mdi:clock-outline" />
        </div>

        <RadioGroup
          label="Mode de consultation"
          name="mode"
          selectedValue={formData.mode}
          onChange={handleChange}
          options={[
            { label: "En ligne", value: "en-ligne" },
            { label: "En cabinet", value: "en-cabinet" },
          ]}
        />

        <div className="flex gap-4 mt-6">
          <button
              type="submit"
              className="flex-1 bg-secondary text-white py-2 rounded hover:bg-blue-700 transition"
          >
              Réserver
          </button>
          <button
              type="button"
              onClick={() => setFormData({ 
                  subject: "", problem: "", description: "", date: "", time: "", mode: "en-ligne" 
              })}
              className="flex-1 bg-gray-200 text-secondary py-2 rounded hover:bg-gray-300 transition"
          >
              Annuler
          </button>
        </div>
      </form>
    </div>
  );
};

export default ConsultationForm;
