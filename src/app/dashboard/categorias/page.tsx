'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function CategoryManager() {
  const [categories, setCategories] = useState<any[]>([]);
  const [newCategory, setNewCategory] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    const { data, error } = await supabase.from('categories').select('*');
    if (!error) setCategories(data || []);
  };

  const handleAddCategory = async () => {
    if (!newCategory) return;
    const { error } = await supabase.from('categories').insert([
      { name: newCategory, description },
    ]);
    if (!error) {
      setNewCategory('');
      setDescription('');
      fetchCategories();
    }
  };

  const handleDeleteCategory = async (id: string) => {
    const { error } = await supabase.from('categories').delete().eq('id', id);
    if (!error) fetchCategories();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-100 to-orange-200 p-4">
      <div className="max-w-xl mx-auto bg-white p-6 rounded shadow">
        <h1 className="text-2xl font-bold mb-4 text-orange-700">Gestión de Categorías</h1>

        <div className="mb-4">
          <input
            type="text"
            placeholder="Nombre de la categoría"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            className="w-full p-2 border mb-2"
          />
          <textarea
            placeholder="Descripción"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 border mb-2"
          />
          <button
            onClick={handleAddCategory}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Agregar Categoría
          </button>
        </div>

        <ul>
          {categories.map((cat) => (
            <li key={cat.id} className="border p-2 rounded mb-2 flex justify-between items-center">
              <div>
                <p className="font-semibold">{cat.name}</p>
                <p className="text-sm text-gray-600">{cat.description}</p>
              </div>
              <button
                onClick={() => handleDeleteCategory(cat.id)}
                className="text-red-600 hover:underline"
              >
                Eliminar
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
