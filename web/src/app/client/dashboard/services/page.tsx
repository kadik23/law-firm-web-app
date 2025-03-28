"use client";
import Myservice from "@/components/dashboard/myServiceCard";
import { useAssignService } from "@/hooks/useAssignService";
import usePagination from "@/hooks/usePagination ";
import { Icon } from "@iconify-icon/react/dist/iconify.mjs";
import React, { useEffect } from "react";

function Services() {
  const blogsPerPage = 6;

  const { fetchAssignService, assignServices } = useAssignService();

  const {
    currentPage,
    totalPages,
    goToPreviousPage,
    goToNextPage,
    generatePaginationNumbers,
    setCurrentPage,
  } = usePagination(assignServices.length, blogsPerPage);

  const startIndex = (currentPage - 1) * blogsPerPage;
  const endIndex = startIndex + blogsPerPage;

  const servicesToDisplay = assignServices.slice(startIndex, endIndex);

  useEffect(() => {
    fetchAssignService();
  }, []);

  return (
    <div className="flex flex-col md:gap-8 gap-6 px-4 md:px-0">
      <div className="flex justify-between items-center w-full px-2">
        <div className="flex gap-2 items-center text-primary">
          <Icon icon="tdesign:service-filled" width={36} height={36} />
          <div className="md:font-extrabold font-semibold md:text-2xl">
            Vos services
          </div>
        </div>
        <div className=" gap-2 items-center md:flex hidden text-secondary  py-2 md:px-4 rounded-lg">
          <Icon icon="tdesign:service-filled" width={24} height={24} />
          <div className="font-semibold">
            Total de services :{" "}
            {assignServices.length < 10
              ? `0${assignServices.length}`
              : assignServices.length}{" "}
          </div>
        </div>
        <div className="text-secondary md:hidden">Total: 06</div>
      </div>
      <div className="flex items-center justify-between gap-8">
        <div
          className="bg-white lg:w-fit w-full px-4 py-2 rounded-lg border-[1px] border-black
                    flex items-center justify-between flex-1 shadow-md max-w-[400px]"
        >
          <input
            type="text"
            placeholder="Rechercher un service"
            name="blog-search-bar"
            id="blog-search"
            className="bg-white w-full h-full outline-none"
          />
          <Icon icon="mdi:search" width={20} />
        </div>

        <button className="bg-btnSecondary hidden md:flex text-white uppercase text-sm px-4 py-2 rounded-md items-center gap-1">
          <Icon icon="mdi:delete" width={20} />
          <span className="">Supprimer tous</span>
        </button>
      </div>
      <div>
        {assignServices.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {servicesToDisplay.map((service, index) => (
              <Myservice service={service} key={index} />
            ))}
          </div>
        ) : (
          <div className="font-semibold text-gray-500 w-full p-4 flex justify-center items-center">
            <h3>No services available at the moment.</h3>
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex gap-3 justify-center items-center mt-4">
            {currentPage > 1 && (
              <button
                onClick={goToPreviousPage}
                className="px-4 py-2 bg-btnSecondary text-white rounded-md"
              >
                Previous
              </button>
            )}

            <div className="flex gap-2">
              {generatePaginationNumbers().map((pageNumber: number) => (
                <button
                  key={pageNumber}
                  onClick={() => setCurrentPage(pageNumber)}
                  className={`px-3 py-2 text-lg rounded-md ${
                    currentPage === pageNumber
                      ? "bg-primary text-white font-bold"
                      : "bg-gray-200 hover:bg-gray-300"
                  }`}
                >
                  {pageNumber}
                </button>
              ))}
            </div>

            {currentPage < totalPages && (
              <button
                onClick={goToNextPage}
                className="px-4 py-2 bg-btnSecondary text-white rounded-md"
              >
                Next
              </button>
            )}
          </div>
        )}
      </div>
      <button className="bg-btnSecondary flex md:hidden justify-center mx-12 text-white uppercase text-sm px-4 py-2 rounded-md items-center gap-1">
        <Icon icon="mdi:delete" width={20} />
        <span className="">Supprimer tous</span>
      </button>
    </div>
  );
}

export default Services;
