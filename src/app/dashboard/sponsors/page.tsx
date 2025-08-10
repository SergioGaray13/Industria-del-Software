'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { v4 as uuidv4 } from 'uuid';

type Sponsor = {
  id: string;
  name: string;
  logo_url: string | null;
  website: string | null;
  description: string | null;
};

export default function SponsorsPage() {
  const router = useRouter();
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingSponsor, setEditingSponsor] = useState<Sponsor | null>(null);
  const [showForm, setShowForm] = useState(false);

  const fetchSponsors = async () => {
    const { data, error } = await supabase
      .from('sponsors')
      .select('id, name, logo_url, website, description');

    if (!error) {
      setSponsors(data || []);
    }
  };

  useEffect(() => {
    const checkSessionAndLoad = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.push('/login');
        return;
      }

      await fetchSponsors();
      setLoading(false);
    };

    checkSessionAndLoad();
  }, [router]);

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from('sponsors').delete().eq('id', id);
    if (!error) await fetchSponsors();
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    const newSponsor: Omit<Sponsor, 'id'> = {
      name: formData.get('name') as string,
      logo_url: formData.get('logo_url') as string,
      website: formData.get('website') as string,
      description: formData.get('description') as string,
    };

    if (editingSponsor) {
      // Update
      await supabase
        .from('sponsors')
        .update(newSponsor)
        .eq('id', editingSponsor.id);
    } else {
      // Create
      await supabase.from('sponsors').insert([
        { ...newSponsor, id: uuidv4() },
      ]);
    }

    setShowForm(false);
    setEditingSponsor(null);
    await fetchSponsors();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-orange-50 flex items-center justify-center text-orange-600">
        Cargando patrocinadores...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-100 to-orange-200 p-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-orange-600">Patrocinadores</h1>
        <button
          className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700 text-sm"
          onClick={() => {
            setEditingSponsor(null);
            setShowForm(true);
          }}
        >
          + Agregar
        </button>
      </div>

      {sponsors.length === 0 ? (
        <p className="text-orange-500">No hay patrocinadores registrados.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sponsors.map((sponsor) => (
            <div
              key={sponsor.id}
              className="bg-white rounded-lg shadow p-4 border border-orange-200"
            >
              {sponsor.logo_url && (
                <div className="w-full h-32 relative mb-4">
                  <Image
                    src={sponsor.logo_url}
                    alt={sponsor.name}
                    fill
                    className="object-contain"
                  />
                </div>
              )}
              <h2 className="text-lg font-semibold text-orange-700">{sponsor.name}</h2>
              {sponsor.description && (
                <p className="text-sm text-gray-600 mt-1">{sponsor.description}</p>
              )}
              {sponsor.website && (
                <a
                  href={sponsor.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:underline mt-1 inline-block"
                >
                  Visitar sitio
                </a>
              )}
              <div className="mt-4 flex gap-2">
                <button
                  className="text-sm text-white bg-blue-500 px-3 py-1 rounded"
                  onClick={() => {
                    setEditingSponsor(sponsor);
                    setShowForm(true);
                  }}
                >
                  Editar
                </button>
                <button
                  className="text-sm text-white bg-red-500 px-3 py-1 rounded"
                  onClick={() => handleDelete(sponsor.id)}
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <form
            onSubmit={handleSubmit}
            className="bg-white p-6 rounded shadow-md w-full max-w-md"
          >
            <h2 className="text-lg font-bold text-orange-600 mb-4">
              {editingSponsor ? 'Editar patrocinador' : 'Nuevo patrocinador'}
            </h2>
            <input
              type="text"
              name="name"
              defaultValue={editingSponsor?.name || ''}
              placeholder="Nombre"
              required
              className="w-full mb-3 p-2 border rounded"
            />
            <input
              type="url"
              name="logo_url"
              defaultValue={editingSponsor?.logo_url || ''}
              placeholder="Logo URL"
              className="w-full mb-3 p-2 border rounded"
            />
            <input
              type="url"
              name="website"
              defaultValue={editingSponsor?.website || ''}
              placeholder="Sitio web"
              className="w-full mb-3 p-2 border rounded"
            />
            <textarea
              name="description"
              defaultValue={editingSponsor?.description || ''}
              placeholder="Descripción"
              className="w-full mb-3 p-2 border rounded"
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingSponsor(null);
                }}
                className="bg-gray-300 px-4 py-2 rounded"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="bg-orange-600 text-white px-4 py-2 rounded"
              >
                Guardar
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
