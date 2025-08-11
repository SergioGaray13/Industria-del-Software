//Barra de búsqueda
//src\components\usuarios\UserSearchBar.tsx
'use client';

interface Props {
  searchTerm: string;
  setSearchTerm: (val: string) => void;
  onAdd: () => void;
}

export default function UserSearchBar({ searchTerm, setSearchTerm, onAdd }: Props) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6 flex flex-col md:flex-row gap-4 justify-between items-center">
      <input
        type="text"
        placeholder="Buscar por nombre, apellido o rol..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="flex-1 px-4 py-2 border rounded-lg"
      />
      <button
        onClick={onAdd}
        className="bg-green-600 text-white px-4 py-2 rounded-lg"
      >
        + Agregar Usuario
      </button>
    </div>
  );
}
