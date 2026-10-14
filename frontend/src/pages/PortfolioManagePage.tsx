import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../lib/api';

interface PortfolioLink {
  id: string;
  label: string;
  url: string;
  tipe: string;
}

export default function PortfolioManagePage() {
  const [links, setLinks] = useState<PortfolioLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    label: '',
    url: '',
    tipe: 'github',
  });
  const navigate = useNavigate();

  useEffect(() => {
    loadLinks();
  }, []);

  const loadLinks = async () => {
    try {
      const { data } = await api.get('/profile/me/portfolio');
      setLinks(data);
    } catch (err) {
      console.error('Failed to load portfolio', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // BR-02.2: Validate https
    if (!formData.url.startsWith('https://')) {
      alert('URL harus menggunakan HTTPS');
      return;
    }

    try {
      if (editingId) {
        await api.patch(`/profile/me/portfolio/${editingId}`, formData);
      } else {
        await api.post('/profile/me/portfolio', formData);
      }
      
      await loadLinks();
      resetForm();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to save portfolio link');
    }
  };

  const handleEdit = (link: PortfolioLink) => {
    setFormData({
      label: link.label,
      url: link.url,
      tipe: link.tipe,
    });
    setEditingId(link.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Hapus tautan ini?')) return;
    
    try {
      await api.delete(`/profile/me/portfolio/${id}`);
      await loadLinks();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to delete link');
    }
  };

  const resetForm = () => {
    setFormData({ label: '', url: '', tipe: 'github' });
    setEditingId(null);
    setShowForm(false);
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
        <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
          <button
            onClick={() => navigate('/profile')}
            className="text-gray-600 hover:text-gray-900"
          >
            ← Kembali
          </button>
          <h1 className="text-xl font-bold text-gray-900">Kelola Portfolio</h1>
          <div className="w-20"></div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-gray-900">Tautan Portfolio</h2>
            {!showForm && (
              <button
                onClick={() => setShowForm(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
              >
                + Tambah Tautan
              </button>
            )}
          </div>

          {/* Form */}
          {showForm && (
            <form onSubmit={handleSubmit} className="mb-6 p-4 border border-blue-200 rounded-lg bg-blue-50">
              <h3 className="font-medium text-gray-900 mb-3">
                {editingId ? 'Edit Tautan' : 'Tambah Tautan Baru'}
              </h3>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Label
                  </label>
                  <input
                    type="text"
                    value={formData.label}
                    onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="GitHub Portfolio"
                    maxLength={50}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    URL (harus HTTPS)
                  </label>
                  <input
                    type="url"
                    value={formData.url}
                    onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="https://github.com/username"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tipe
                  </label>
                  <select
                    value={formData.tipe}
                    onChange={(e) => setFormData({ ...formData, tipe: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="github">GitHub</option>
                    <option value="linkedin">LinkedIn</option>
                    <option value="behance">Behance</option>
                    <option value="lainnya">Lainnya</option>
                  </select>
                </div>

                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="flex-1 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    {editingId ? 'Simpan Perubahan' : 'Tambah'}
                  </button>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                  >
                    Batal
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* Links List */}
          {links.length === 0 ? (
            <p className="text-center text-gray-500 py-8">Belum ada tautan portfolio</p>
          ) : (
            <div className="space-y-3">
              {links.map((link) => (
                <div
                  key={link.id}
                  className="p-4 border border-gray-200 rounded-lg hover:border-gray-300"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{link.label}</p>
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:underline"
                      >
                        {link.url}
                      </a>
                      <p className="text-xs text-gray-500 mt-1">
                        Tipe: {link.tipe}
                      </p>
                    </div>
                    
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(link)}
                        className="text-sm text-blue-600 hover:text-blue-700"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(link.id)}
                        className="text-sm text-red-600 hover:text-red-700"
                      >
                        Hapus
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
