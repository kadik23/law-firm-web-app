import { Controller } from "react-hook-form";
import SelectInput from "./SelectInput";
import DateTimeInput from "./DateTimeInput";
import RadioGroup from "./RadioGroup";
import TextInput from "./TextInput";
import { useConsultationForm } from "@/hooks/clients/useConsultationForm";
import useConsultationHForm from "@/hooks/hooksForms/useConsultationForm";

const ConsultationForm: React.FC = () => {
  const { problems, loading, error, submitConsultation, getAllowedDates, getFilteredTimes } = useConsultationForm();
  const { register, handleSubmit, watch, control, formState: { errors, isValid }, reset } = useConsultationHForm();

  const selectedDate = watch("date");
  const allowedDates = getAllowedDates();
  const filteredTimes = getFilteredTimes(selectedDate);

  const onSubmit = async (data: any) => {
    await submitConsultation({
      problem_id: data.problem_id,
      problem_description: data.problem_description,
      time: data.time,
      date: data.date,
      mode: data.mode,
      meeting_link: data.mode === "online" ? data.meeting_link || null : null,
      problem_name: data.problem_name
    });
    reset();
  };

  return (
    <div className="p-6 text-white">
      <h2 className="text-xl font-semibold mb-6">
        Veuillez remplir ce formulaire pour réserver <br />
        une consultation gratuite !
      </h2>
      {loading && <div>Chargement...</div>}
      {error && <div className="text-red-500">{error}</div>}
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex gap-3 py-2 items-center h-16">
          <TextInput
            label="Sujet de consultation"
            placeholder="Entrez le sujet"
            {...register("problem_name", { required: "Sujet requis" })}
          />
          <Controller
            name="problem_id"
            control={control}
            rules={{ required: "Problème requis" }}
            render={({ field }) => (
              <SelectInput
                label="Sélection du problème"
                options={[
                  { label: "Sélectionner...", value: "" },
                  ...problems.map(p => ({ label: p.name, value: String(p.id) })),
                ]}
                value={field.value ?? ""}
                onChange={field.onChange}
              />
            )}
          />
        </div>
        {errors.problem_name && <div className="text-red-500 text-xs">{errors.problem_name.message as string}</div>}
        {errors.problem_id && <div className="text-red-500 text-xs">{errors.problem_id.message as string}</div>}
        <div className="mt-4">
          <TextInput
            label="Description du problème"
            placeholder="Décrivez votre problème..."
            {...register("problem_description", { required: "Description requise" })}
          />
          {errors.problem_description && <div className="text-red-500 text-xs">{errors.problem_description.message as string}</div>}
        </div>
        <div className="flex gap-3 py-2 items-center w-full h-16 mt-4">
          <Controller
            name="date"
            control={control}
            rules={{ required: "Date requise" }}
            render={({ field }) => (
              <DateTimeInput
                label="Choisir une date"
                type="date"
                icon="mdi:calendar"
                value={field.value ?? ""}
                onChange={field.onChange}
                allowedDates={allowedDates}
              />
            )}
          />
          <Controller
            name="time"
            control={control}
            rules={{ required: "Heure requise" }}
            render={({ field }) => (
              <SelectInput
                label="Choisir une heure"
                options={[
                  { label: "Sélectionner...", value: "" },
                  ...filteredTimes,
                ]}
                value={field.value ?? ""}
                onChange={field.onChange}
              />
            )}
          />
        </div>
        {errors.date && <div className="text-red-500 text-xs">{errors.date.message as string}</div>}
        {errors.time && <div className="text-red-500 text-xs">{errors.time.message as string}</div>}
        <Controller
          name="mode"
          control={control}
          rules={{ required: "Mode requis" }}
          defaultValue={"online"}
          render={({ field }) => (
            <RadioGroup
              label="Mode de consultation"
              name="mode"
              selectedValue={field.value ?? ""}
              onChange={field.onChange}
              options={[
                { label: "En ligne", value: "online" },
                { label: "En cabinet", value: "onsite" },
              ]}
            />
          )}
        />
        {errors.mode && <div className="text-red-500 text-xs">{errors.mode.message as string}</div>}
        <div className="flex gap-4 mt-6">
          <button
            type="submit"
            className={`flex-1 bg-secondary text-white py-2 rounded hover:bg-blue-700 transition ${!isValid ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={!isValid}
          >
            Réserver
          </button>
          <button
            type="button"
            onClick={() => reset()}
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