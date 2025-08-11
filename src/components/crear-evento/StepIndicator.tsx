//src\components\crear-evento\StepIndicator.tsx
interface StepIndicatorProps {
    currentStep: number;
  }
  
  export default function StepIndicator({ currentStep }: StepIndicatorProps) {
    return (
      <div className="flex items-center justify-center mb-8">
        {[1, 2, 3].map((step) => (
          <div key={step} className="flex items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors
                ${step <= currentStep
                  ? 'bg-orange-500 text-white shadow-lg'
                  : 'bg-gray-200 text-gray-500'
                }`}
            >
              {step}
            </div>
            {step < 3 && (
              <div
                className={`w-16 h-1 mx-2 transition-colors
                  ${step < currentStep ? 'bg-orange-500' : 'bg-gray-200'}
                `}
              />
            )}
          </div>
        ))}
      </div>
    );
  }
  