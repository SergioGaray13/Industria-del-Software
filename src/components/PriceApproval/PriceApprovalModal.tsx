'use client';

import { useState, useEffect } from "react";

interface PriceApprovalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApprove: (price: number) => void;
  priceDetails: {
    salonPrice: number;
    cateringPrice: number;
    serviceStaff: number;
    serviceModeCost: number;
    total: number;
  } | null;
  event: any;
}

export default function PriceApprovalModal({
  isOpen,
  onClose,
  onApprove,
  priceDetails,
  event
}: PriceApprovalModalProps) {
const [customPrice, setCustomPrice] = useState<number>(0);

useEffect(() => {
    if (priceDetails) {
        setCustomPrice(priceDetails.total);
    }
}, [priceDetails]);

if (!isOpen || !priceDetails) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h2 className="text-xl font-bold mb-4">Aprobar Precio para Evento</h2>
        <h3 className="text-lg font-semibold mb-2">{event?.title}</h3>
        
        <div className="space-y-2 mb-4">
          <div className="flex justify-between">
            <span>Salón ({event?.booking?.hours_reserved || 1} horas):</span>
            <span>${priceDetails.salonPrice.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Catering ({event?.booking?.number_of_guests || 0} invitados):</span>
            <span>${priceDetails.cateringPrice.toFixed(2)}</span>
          </div>
          {priceDetails.serviceStaff > 0 && (
            <div className="flex justify-between">
              <span>Personal de servicio:</span>
              <span>${priceDetails.serviceStaff.toFixed(2)}</span>
            </div>
          )}
          {priceDetails.serviceModeCost > 0 && (
            <div className="flex justify-between">
              <span>Modalidad de servicio:</span>
              <span>${priceDetails.serviceModeCost.toFixed(2)}</span>
            </div>
          )}
          <div className="border-t pt-2 font-bold flex justify-between">
            <span>Total calculado:</span>
            <span>${priceDetails.total.toFixed(2)}</span>
          </div>
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">
            Precio a aprobar:
          </label>
          <input
            type="number"
            value={customPrice}
            onChange={(e) => setCustomPrice(Number(e.target.value))}
            className="w-full p-2 border rounded"
            min={0}
            step={0.01}
          />
          <p className="text-xs text-gray-500 mt-1">
            Puede ajustar el precio si es necesario
          </p>
        </div>
        
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded"
          >
            Cancelar
          </button>
          <button
            onClick={() => onApprove(customPrice)}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Aprobar Precio
          </button>
        </div>
      </div>
    </div>
  );
}