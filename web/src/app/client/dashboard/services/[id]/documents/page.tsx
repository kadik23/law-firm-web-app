import { Icon } from "@iconify-icon/react/dist/iconify.mjs";

const Documents = () => {
  return (
    <div className="flex flex-col md:gap-8 gap-6 md:pt-2 relative">
      <div className="flex justify-between w-full px-2">
        <div className="flex gap-2 items-center text-primary">
          <Icon icon="solar:document-outline" width={32} height={32} />
          <div className="md:font-extrabold font-semibold md:text-xl">
            Documents
          </div>
        </div>
        <div className=" gap-2 items-center md:flex hidden text-white bg-secondary  py-2 md:px-4 rounded-lg">
          <Icon icon="tdesign:service-filled" />
          <div className="font-semibold text-lg">Total de services : 06 </div>
        </div>
        <div className="text-secondary md:hidden">06 services</div>
      </div>
      <div className=" rounded-2xl bg-white md:shadow-md">
        <div className="border-b border-gray-400/25 pb-4 md:py-4 md:px-8 font-semibold md:text-lg w-full px-2">
          Voici les documents que vous allez ajouter pour le “nom de service”
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 py-4 md:px-8 text-sm px-2">
          <div className="flex gap-1">
            <div className="font-bold">1-</div> Fiche de résidence{" "}
          </div>
          <div className="flex gap-1">
            <div className="font-bold">2-</div> Fiche de résidence{" "}
          </div>
          <div className="flex gap-1">
            <div className="font-bold">3-</div> Fiche de résidence{" "}
          </div>
          <div className="flex gap-1">
            <div className="font-bold">4-</div> Fiche de résidence{" "}
          </div>
          <div className="flex gap-1">
            <div className="font-bold">5-</div> Fiche de résidence{" "}
          </div>
          <div className="flex gap-1">
            <div className="font-bold">6-</div> Fiche de résidence{" "}
          </div>
          <div className="flex gap-1">
            <div className="font-bold">7-</div> Fiche de résidence{" "}
          </div>
          <div className="flex gap-1">
            <div className="font-bold">8-</div> Fiche de résidence{" "}
          </div>
        </div>
        <div className="bg-[#4A84AA] bg-opacity-25 rounded-b-2xl px-8 py-4">
          <input
            type="file"
            name=""
            id=""
            className=" bg-transparent cursor-pointer border-2 p-2 rounded-2xl w-full border-dashed border-[#4A84AA] "
          />
        </div>
      </div>
      <div className="border-b">
        <div className="flex justify-between items-center">
          <div className="border-b border-gray-400/25 md:py-4 md:px-8 text-primary font-semibold md:text-lg w-full px-2">
            Voici les documents que vous allez ajouter pour le “nom de service”
          </div>
          <div className="shadow-md md:flex gap-2 items-center hidden cursor-pointer text-secondary hover:text-white hover:bg-secondary transition-all duration-200 bg-white px-4 py-2 rounded-xl">
            <Icon icon="material-symbols:delete" width="24" height="24" />
            <div className="font-semibold text-nowrap">Suprimer tous </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 text-sm gap-4 py-4 md:px-8  px-2">
          <div className="flex gap-2 items-center">
            <div className="font-bold border hover:border-red-500 hover:text-red-500 cursor-pointer border-primary text-primary rounded-full w-8 h-8 flex items-center justify-center">
              <Icon icon="material-symbols:delete" width="24" height="24" />
            </div>{" "}
            Fiche de résidence{" "}
          </div>
          <div className="flex gap-2 items-center">
            <div className="font-bold border hover:border-red-500 hover:text-red-500 cursor-pointer border-primary text-primary rounded-full w-8 h-8 flex items-center justify-center">
              <Icon icon="material-symbols:delete" width="24" height="24" />
            </div>{" "}
            Fiche de résidence{" "}
          </div>
          <div className="flex gap-2 items-center">
            <div className="font-bold border hover:border-red-500 hover:text-red-500 cursor-pointer border-primary text-primary rounded-full w-8 h-8 flex items-center justify-center">
              <Icon icon="material-symbols:delete" width="24" height="24" />
            </div>{" "}
            Fiche de résidence{" "}
          </div>
          <div className="flex gap-2 items-center">
            <div className="font-bold border hover:border-red-500 hover:text-red-500 cursor-pointer border-primary text-primary rounded-full w-8 h-8 flex items-center justify-center">
              <Icon icon="material-symbols:delete" width="24" height="24" />
            </div>{" "}
            Fiche de résidence{" "}
          </div>
          <div className="flex gap-2 items-center">
            <div className="font-bold border hover:border-red-500 hover:text-red-500 cursor-pointer border-primary text-primary rounded-full w-8 h-8 flex items-center justify-center">
              <Icon icon="material-symbols:delete" width="24" height="24" />
            </div>{" "}
            Fiche de résidence{" "}
          </div>
          <div className="flex gap-2 items-center">
            <div className="font-bold border hover:border-red-500 hover:text-red-500 cursor-pointer border-primary text-primary rounded-full w-8 h-8 flex items-center justify-center">
              <Icon icon="material-symbols:delete" width="24" height="24" />
            </div>{" "}
            Fiche de résidence{" "}
          </div>
        </div>
      </div>
      <div className="shadow-md cursor-pointer w-fit mx-auto md:mx-0 md:ml-auto flex gap-2 items-center text-secondary hover:text-white hover:bg-secondary transition-all duration-200 bg-white px-8 py-2 rounded-xl">
        <div className="font-semibold text-nowrap">Envoyer Les</div>
      </div>
      <div className="font-bold absolute md:hidden bottom-20 right-4 border shadow-md hover:text-secondary transition-all duration-200 bg-primary text-white rounded-xl w-12 h-10 flex items-center justify-center">
        <Icon icon="material-symbols:delete" width="24" height="24" />
      </div>
    </div>
  );
};

export default Documents;
