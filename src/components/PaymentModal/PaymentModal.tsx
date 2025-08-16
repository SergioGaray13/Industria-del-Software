'use client';
import { useState } from 'react';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPayment: (method: string) => void;
  amount: number;
}

export default function PaymentModal({
  isOpen,
  onClose,
  onPayment,
  amount
}: PaymentModalProps) {
  const [paymentMethod, setPaymentMethod] = useState('tarjeta');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h2 className="text-xl font-bold mb-4">Realizar Pago</h2>
        <p className="mb-4">Total a pagar: <span className="font-bold">${amount.toFixed(2)}</span></p>
        
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Método de pago:</label>
          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="tarjeta">Tarjeta de crédito/débito</option>
            <option value="transferencia">Transferencia bancaria</option>
            <option value="efectivo">Efectivo</option>
          </select>
        </div>
        
        {paymentMethod === 'tarjeta' && (
          <div className="mb-4 space-y-3">
            <div>
              <label className="block text-sm font-medium mb-1">Número de tarjeta</label>
              <input
                type="text"
                placeholder="1234 5678 9012 3456"
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium mb-1">Fecha expiración</label>
                <input
                  type="text"
                  placeholder="MM/AA"
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">CVV</label>
                <input
                  type="text"
                  placeholder="123"
                  className="w-full p-2 border rounded"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Nombre en tarjeta</label>
              <input
                type="text"
                placeholder="Como aparece en la tarjeta"
                className="w-full p-2 border rounded"
              />
            </div>
          </div>
        )}
        
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded"
          >
            Cancelar
          </button>
          <button
            onClick={() => onPayment(paymentMethod)}
            className="px-4 py-2 bg-green-600 text-white rounded"
          >
            Confirmar Pago
          </button>
        </div>
      </div>
    </div>
  );
}