import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../lib/api';

interface Opportunity {
  id: string;
  judul: string;
  deskripsi: string;
  jenis: string;
  kategori: string;
  mode: string;
  tenggat: string | null;
  status: string;
  owner: {
    profile: {
      namaTampilan: string;
    };
  };
  positions: Array<{
    id: string;
    nama: string;
    jumlahSlot: number;
  }>;
}

export default function OpportunitiesPage() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterJenis, setFilterJenis] = useState('');
  const [filterKategori, setFilterKategori] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    loadOpportunities();
  }, [filterJenis, filterKategori]);

  const loadOpportunities = async () => {
    try {
      const params = new URLSearchParams();
      if (filterJenis) params.append('jenis', filterJenis);
      if (filterKategori) params.append('kategori', filterKategori);
      params.append('status', 'open');

      const { data } = await api.get(`/opportunities?${params}`);
      setOpportunities(data);
    } catch (err) {
      console.error('Failed to load opportunities', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-900">Peluang Tim</h1>
          <div className="flex gap-4">
            <button
              onClick={() => navigate('/opportunities/create')}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
            >
              + Buat Peluang
            </button>
            <button
              onClick={() => navigate('/profile')}
              className="text-gray-600 hover:text-gray-900"
            >
              Profil
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Jenis
              </label>
              <select
                value={filterJenis}
                onChange={(e) => setFilterJenis(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="">Semua</option>
                <option value="lomba">Lomba</option>
                <option value="proyek">Proyek</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Kategori
              </label>
              <input
                type="text"
                value={filterKategori}
                onChange={(e) => setFilterKategori(e.target.value)}
                placeholder="Technology, Design, etc."
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>
        </div>

        {/* Opportunities List */}
        {opportunities.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-500">Belum ada peluang</p>
          </div>
        ) : (
          <div className="space-y-4">
            {opportunities.map((opp) => (
              <div
                key={opp.id}
                className="bg-white rounded-lg shadow p-6 hover:shadow-md transition cursor-pointer"
                onClick={() => navigate(`/opportunities/${opp.id}`)}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {opp.judul}
                    </h3>
                    <p className="text-gray-600 mb-3 line-clamp-2">
                      {opp.deskripsi}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-3">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                        {opp.jenis}
                      </span>
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                        {opp.kategori}
                      </span>
                      <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded">
                        {opp.mode}
                      </span>
                    </div>

                    <div className="text-sm text-gray-500">
                      <p>Owner: {opp.owner.profile.namaTampilan}</p>
                      <p>Posisi: {opp.positions.length}</p>
                      {opp.tenggat && (
                        <p>Tenggat: {new Date(opp.tenggat).toLocaleDateString()}</p>
                      )}
                    </div>
                  </div>

                  <span className={`px-3 py-1 rounded text-sm ${
                    opp.status === 'open'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {opp.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
