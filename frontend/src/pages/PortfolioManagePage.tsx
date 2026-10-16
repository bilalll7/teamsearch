import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoadingSpinner } from '../components/LoadingSpinner';
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
      <div className="min-h-screen w-full bg-background text-foreground">
        <main className="flex items-center justify-center pt-16">
          <div className="px-6 py-24">
            <LoadingSpinner />
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full overflow-x-clip bg-background text-foreground">
      <main className="w-full pt-16">
        <div className="w-full border-b border-border-subtle">
          <div className="mx-auto flex w-full max-w-4xl items-center justify-between px-6 py-4">
            <button
              onClick={() => navigate('/profile')}
              className="text-[15px] font-medium text-muted-foreground hover:text-foreground"
            >
              ← Kembali
            </button>
            <h1 className="text-xl font-bold tracking-tight">Kelola Portfolio</h1>
            <div className="w-20" aria-hidden="true" />
          </div>
        </div>

        <div className="mx-auto w-full max-w-4xl px-6 py-8">
          <div className="rounded-xl border border-border bg-surface p-6">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-lg font-bold">Tautan Portfolio</h2>
              {!showForm && (
                <button
                  onClick={() => setShowForm(true)}
                  className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-hover"
                >
                  + Tambah Tautan
                </button>
              )}
            </div>

            {/* Form */}
            {showForm && (
              <form onSubmit={handleSubmit} className="mb-6 rounded-lg border border-primary/30 bg-primary/5 p-4">
                <h3 className="mb-3 font-medium">
                  {editingId ? 'Edit Tautan' : 'Tambah Tautan Baru'}
                </h3>
                
                <div className="space-y-3">
                  <div>
                    <label className="mb-1 block text-sm font-medium">
                      Label
                    </label>
                    <input
                      type="text"
                      value={formData.label}
                      onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                      className="h-12 w-full rounded-lg border border-border bg-background px-3.5 text-[15px] placeholder:text-muted-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      placeholder="GitHub Portfolio"
                      maxLength={50}
                      required
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium">
                      URL (harus HTTPS)
                    </label>
                    <input
                      type="url"
                      value={formData.url}
                      onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                      className="h-12 w-full rounded-lg border border-border bg-background px-3.5 text-[15px] placeholder:text-muted-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      placeholder="https://github.com/username"
                      required
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium">
                      Tipe
                    </label>
                    <select
                      value={formData.tipe}
                      onChange={(e) => setFormData({ ...formData, tipe: e.target.value })}
                      className="h-12 w-full rounded-lg border border-border bg-background px-3.5 text-[15px] focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
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
                      className="flex-1 rounded-md bg-primary py-2 text-white hover:bg-primary-hover"
                    >
                      {editingId ? 'Simpan Perubahan' : 'Tambah'}
                    </button>
                    <button
                      type="button"
                      onClick={resetForm}
                      className="rounded-md bg-surface-elevated px-4 py-2 text-muted-foreground hover:text-foreground"
                    >
                      Batal
                    </button>
                  </div>
                </div>
              </form>
            )}

            {/* Links List */}
            {links.length === 0 ? (
              <p className="py-8 text-center text-muted-foreground">Belum ada tautan portfolio</p>
            ) : (
              <div className="space-y-3">
                {links.map((link) => (
                  <div
                    key={link.id}
                    className="rounded-lg border border-border bg-background p-4"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="font-medium">{link.label}</p>
                        <a
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-primary hover:underline"
                        >
                          {link.url}
                        </a>
                        <p className="mt-1 text-xs text-muted-foreground">
                          Tipe: {link.tipe}
                        </p>
                      </div>
                      
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(link)}
                          className="text-sm font-medium text-primary hover:opacity-80"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(link.id)}
                          className="text-sm font-medium text-destructive hover:opacity-80"
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
      </main>
    </div>
  );
}
