//src\components\crear-evento\InputField.tsx
interface InputFieldProps {
    label: string;
    error?: string;
    required?: boolean;
    children: React.ReactNode;
  }
  
  export default function InputField({ label, error, required = false, children }: InputFieldProps) {
    return (
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        {children}
        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
      </div>
    );
  }
  