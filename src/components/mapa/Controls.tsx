interface ControlsProps {
    escala: number;
    filtroEstado: 'todos' | 'disponible' | 'ocupado' | 'reservado';
    onZoomIn: () => void;
    onZoomOut: () => void;
    onReset: () => void;
    onFilterChange: (filtro: 'todos' | 'disponible' | 'ocupado' | 'reservado') => void;
  }
  
  export const Controls: React.FC<ControlsProps> = ({
    escala,
    filtroEstado,
    onZoomIn,
    onZoomOut,
    onReset,
    onFilterChange
  }) => {
    return (
      <div className="flex items-center gap-4">
        <div className="flex gap-2">
          <label className="text-sm text-gray-600">Filtrar:</label>
          <select
            value={filtroEstado}
            onChange={(e) => onFilterChange(e.target.value as any)}
            className="px-2 py-1 border rounded text-sm"
          >
            <option value="todos">Todos</option>
            <option value="disponible">Disponibles</option>
            <option value="ocupado">En Uso</option>
            <option value="reservado">Reservados</option>
          </select>
        </div>
        
        <div className="flex gap-2">
          <button onClick={onZoomOut} className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300">-</button>
          <span className="px-2 py-1 text-sm">{Math.round(escala * 100)}%</span>
          <button onClick={onZoomIn} className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300">+</button>
          <button onClick={onReset} className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300">Reset</button>
        </div>
      </div>
    );
  };