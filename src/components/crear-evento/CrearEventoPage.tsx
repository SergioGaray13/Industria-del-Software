// src/components/crear-evento/CrearEventoPage.tsx
'use client';

import { useRouter } from 'next/navigation';
import StepIndicator from './StepIndicator';
import Step1BasicInfo from './Step1BasicInfo';
import Step2LocationContact from './Step2LocationContact';
import Step3AdditionalDetails from './Step3AdditionalDetails';
import { useCrearEventoForm } from '@/hooks/useCrearEventoForm';

export default function CrearEventoPage() {
  const router = useRouter();

  const {
    formState,
    errors,
    currentStep,
    isLoading,
    showSuccess,
    supabaseData,
    filteredMenus,
    filteredSalones, // 👈 ahora lo usamos
    updateFormField,
    nextStep,
    prevStep,
    resetForm,
    handleSubmit,
  } = useCrearEventoForm(router);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">Crear Evento</h1>

      <StepIndicator currentStep={currentStep} />

      {showSuccess && (
        <div
          className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6"
          role="alert"
        >
          <strong className="font-bold">¡Éxito!</strong> El evento ha sido creado correctamente.
        </div>
      )}

      {currentStep === 1 && (
        <Step1BasicInfo
          formState={formState}
          errors={errors}
          updateFormField={updateFormField}
          categories={supabaseData.categories}
          providers={supabaseData.providers}
        />
      )}

      {currentStep === 2 && (
        <Step2LocationContact
          formState={formState}
          errors={errors}
          updateFormField={updateFormField}
          places={supabaseData.lugares}
          locations={filteredSalones} // 👈 ahora pasamos solo los salones filtrados
        />
      )}

      {currentStep === 3 && (
        <Step3AdditionalDetails
          formState={formState}
          updateFormField={updateFormField}
          catering={supabaseData.catering}
          filteredMenus={filteredMenus}
          serviceModes={supabaseData.serviceModes}
        />
      )}

      <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
        <div className="flex gap-3">
          <button
            onClick={prevStep}
            disabled={currentStep === 1}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center"
          >
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Anterior
          </button>

          <button
            onClick={resetForm}
            className="px-4 py-2 border border-red-300 rounded-lg text-red-600 hover:bg-red-50 transition-all duration-200 text-sm flex items-center"
          >
            <svg
              className="w-4 h-4 mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
            Limpiar
          </button>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-500 font-medium">
            Paso {currentStep} de 3
          </div>

          {currentStep < 3 ? (
            <button
              onClick={nextStep}
              className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-all duration-200 flex items-center shadow-md hover:shadow-lg"
            >
              Siguiente
              <svg
                className="w-4 h-4 ml-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center shadow-md hover:shadow-lg"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span className="ml-2">Creando...</span>
                </>
              ) : (
                <>
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  Crear Evento
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
