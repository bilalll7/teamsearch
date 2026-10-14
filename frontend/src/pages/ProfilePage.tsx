import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../lib/api';

interface Profile {
  id: string;
  namaTampilan: string;
  bio: string | null;
  programStudi: string | null;
  angkatan: string | null;
  ketersediaan: boolean;
}

interface PortfolioLink {
  id: string;
  label: string;
  url: string;
  tipe: string;
}

interface UserSkill {
  id: string;
  level: number;
  skill: {
    id: string;
    nama: string;
    kategori: {
      nama: string;
    };
  };
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [portfolio, setPortfolio] = useState<PortfolioLink[]>([]);
  const [skills, setSkills] = useState<UserSkill[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    namaTampilan: '',
    bio: '',
    programStudi: '',
    angkatan: '',
  });
  const navigate = useNavigate();

  useEffect(() => {
    loadProfile();
    loadPortfolio();
    loadSkills();
  }, []);

  const loadProfile = async () => {
    try {
      const { data } = await api.get('/profile/me');
      setProfile(data);
      setFormData({
        namaTampilan: data.namaTampilan || '',
        bio: data.bio || '',
        programStudi: data.programStudi || '',
        angkatan: data.angkatan || '',
      });
    } catch (err) {
      console.error('Failed to load profile', err);
    } finally {
      setLoading(false);
    }
  };

  const loadPortfolio = async () => {
    try {
      const { data } = await api.get('/profile/me/portfolio');
      setPortfolio(data);
    } catch (err) {
      console.error('Failed to load portfolio', err);
    }
  };

  const loadSkills = async () => {
    try {
      const { data } = await api.get('/skills/me');
      setSkills(data);
    } catch (err) {
      console.error('Failed to load skills', err);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.patch('/profile/me', formData);
      await loadProfile();
      setEditing(false);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to update profile');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-red-600">Profile not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-900">TeamSearch</h1>
          <button
            onClick={handleLogout}
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            Logout
          </button>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        {/* Profile Card */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-2xl font-bold text-gray-900">Profil Saya</h2>
            <button
              onClick={() => setEditing(!editing)}
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              {editing ? 'Batal' : 'Edit'}
            </button>
          </div>

          {editing ? (
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Nama Tampilan
                </label>
                <input
                  type="text"
                  value={formData.namaTampilan}
                  onChange={(e) => setFormData({ ...formData, namaTampilan: e.target.value })}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Bio
                </label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                  rows={3}
                  maxLength={300}
                />
                <p className="mt-1 text-xs text-gray-500">
                  {formData.bio.length}/300 karakter
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Program Studi
                </label>
                <input
                  type="text"
                  value={formData.programStudi}
                  onChange={(e) => setFormData({ ...formData, programStudi: e.target.value })}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Angkatan
                </label>
                <input
                  type="text"
                  value={formData.angkatan}
                  onChange={(e) => setFormData({ ...formData, angkatan: e.target.value })}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="2020"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Simpan
              </button>
            </form>
          ) : (
            <div className="space-y-3">
              <div>
                <span className="text-sm font-medium text-gray-500">Nama:</span>
                <p className="text-gray-900">{profile.namaTampilan}</p>
              </div>
              {profile.bio && (
                <div>
                  <span className="text-sm font-medium text-gray-500">Bio:</span>
                  <p className="text-gray-900">{profile.bio}</p>
                </div>
              )}
              {profile.programStudi && (
                <div>
                  <span className="text-sm font-medium text-gray-500">Program Studi:</span>
                  <p className="text-gray-900">{profile.programStudi}</p>
                </div>
              )}
              {profile.angkatan && (
                <div>
                  <span className="text-sm font-medium text-gray-500">Angkatan:</span>
                  <p className="text-gray-900">{profile.angkatan}</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Skills Card */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-xl font-bold text-gray-900">Keahlian</h3>
            <button
              onClick={() => navigate('/profile/skills')}
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              Kelola
            </button>
          </div>

          {skills.length === 0 ? (
            <p className="text-gray-500 text-sm">Belum ada keahlian ditambahkan</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {skills.map((us) => (
                <span
                  key={us.id}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                >
                  {us.skill.nama} <span className="ml-1 text-xs">Lv{us.level}</span>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Portfolio Card */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-xl font-bold text-gray-900">Portfolio</h3>
            <button
              onClick={() => navigate('/profile/portfolio')}
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              Kelola
            </button>
          </div>

          {portfolio.length === 0 ? (
            <p className="text-gray-500 text-sm">Belum ada tautan portfolio</p>
          ) : (
            <div className="space-y-2">
              {portfolio.map((link) => (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-3 border border-gray-200 rounded hover:bg-gray-50"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">{link.label}</p>
                      <p className="text-sm text-gray-500">{link.tipe}</p>
                    </div>
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </div>
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
