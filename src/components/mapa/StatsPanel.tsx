interface StatsPanelProps {
    total: number;
    disponibles: number;
    ocupados: number;
    reservados: number;
    capacidadTotal: number;
  }
  
  export const StatsPanel: React.FC<StatsPanelProps> = ({
    total,
    disponibles,
    ocupados,
    reservados,
    capacidadTotal
  }) => {
    return (
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
        <div className="text-center p-2 bg-gray-100 rounded">
          <div className="text-lg font-bold text-gray-700">{total}</div>
          <div className="text-sm text-gray-600">Total Salones</div>
        </div>
        <div className="text-center p-2 bg-green-100 rounded">
          <div className="text-lg font-bold text-green-700">{disponibles}</div>
          <div className="text-sm text-green-600">Disponibles</div>
        </div>
        <div className="text-center p-2 bg-yellow-100 rounded">
          <div className="text-lg font-bold text-yellow-700">{ocupados}</div>
          <div className="text-sm text-yellow-600">En Uso</div>
        </div>
        <div className="text-center p-2 bg-purple-100 rounded">
          <div className="text-lg font-bold text-purple-700">{reservados}</div>
          <div className="text-sm text-purple-600">Reservados</div>
        </div>
        <div className="text-center p-2 bg-blue-100 rounded">
          <div className="text-lg font-bold text-blue-700">{capacidadTotal}</div>
          <div className="text-sm text-blue-600">Capacidad Total</div>
        </div>
      </div>
    );
  };