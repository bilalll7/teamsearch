import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../lib/api';

interface Skill {
  id: string;
  nama: string;
  kategori: {
    id: string;
    nama: string;
  };
}

interface SkillCategory {
  id: string;
  nama: string;
}

interface UserSkill {
  id: string;
  level: number;
  skill: Skill;
}

export default function SkillsManagePage() {
  const [categories, setCategories] = useState<SkillCategory[]>([]);
  const [allSkills, setAllSkills] = useState<Skill[]>([]);
  const [userSkills, setUserSkills] = useState<UserSkill[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    loadSkills();
  }, [selectedCategory, searchTerm]);

  const loadData = async () => {
    try {
      const [catRes, userSkillsRes] = await Promise.all([
        api.get('/skills/categories'),
        api.get('/skills/me'),
      ]);
      setCategories(catRes.data);
      setUserSkills(userSkillsRes.data);
    } catch (err) {
      console.error('Failed to load data', err);
    } finally {
      setLoading(false);
    }
  };

  const loadSkills = async () => {
    try {
      const params = new URLSearchParams();
      if (selectedCategory) params.append('kategori', selectedCategory);
      if (searchTerm) params.append('search', searchTerm);
      
      const { data } = await api.get(`/skills?${params}`);
      setAllSkills(data);
    } catch (err) {
      console.error('Failed to load skills', err);
    }
  };

  const handleAddSkill = async (skillId: string, level: number) => {
    try {
      await api.post('/skills/me', { skillId, level });
      await loadData();
      await loadSkills();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to add skill');
    }
  };

  const handleUpdateLevel = async (userSkillId: string, level: number) => {
    try {
      await api.patch(`/skills/me/${userSkillId}`, { level });
      await loadData();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to update skill');
    }
  };

  const handleRemoveSkill = async (userSkillId: string) => {
    if (!confirm('Hapus skill ini?')) return;
    
    try {
      await api.delete(`/skills/me/${userSkillId}`);
      await loadData();
      await loadSkills();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to remove skill');
    }
  };

  const isSkillAdded = (skillId: string) => {
    return userSkills.some((us) => us.skill.id === skillId);
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
          <button
            onClick={() => navigate('/profile')}
            className="text-gray-600 hover:text-gray-900"
          >
            ← Kembali
          </button>
          <h1 className="text-xl font-bold text-gray-900">Kelola Keahlian</h1>
          <div className="w-20"></div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* My Skills */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6 sticky top-8">
              <h2 className="text-lg font-bold text-gray-900 mb-4">
                Keahlian Saya ({userSkills.length}/20)
              </h2>
              
              {userSkills.length === 0 ? (
                <p className="text-sm text-gray-500">Belum ada keahlian</p>
              ) : (
                <div className="space-y-3">
                  {userSkills.map((us) => (
                    <div
                      key={us.id}
                      className="p-3 border border-gray-200 rounded"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <p className="font-medium text-gray-900 text-sm">{us.skill.nama}</p>
                          <p className="text-xs text-gray-500">{us.skill.kategori.nama}</p>
                        </div>
                        <button
                          onClick={() => handleRemoveSkill(us.id)}
                          className="text-red-500 hover:text-red-700 text-sm"
                        >
                          ✕
                        </button>
                      </div>
                      
                      <div className="flex gap-1">
                        {[1, 2, 3].map((lvl) => (
                          <button
                            key={lvl}
                            onClick={() => handleUpdateLevel(us.id, lvl)}
                            className={`flex-1 py-1 text-xs rounded ${
                              us.level === lvl
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                          >
                            Lv{lvl}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Skill Catalog */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Katalog Keahlian</h2>
              
              {/* Filters */}
              <div className="mb-4 space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Kategori
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="">Semua Kategori</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.nama}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cari Skill
                  </label>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Ketik nama skill..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
              </div>

              {/* Skills Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {allSkills.map((skill) => {
                  const added = isSkillAdded(skill.id);
                  return (
                    <div
                      key={skill.id}
                      className={`p-3 border rounded ${
                        added
                          ? 'border-green-300 bg-green-50'
                          : 'border-gray-200 hover:border-blue-300'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-medium text-gray-900 text-sm">{skill.nama}</p>
                          <p className="text-xs text-gray-500">{skill.kategori.nama}</p>
                        </div>
                        {added && (
                          <span className="text-xs text-green-600">✓ Added</span>
                        )}
                      </div>
                      
                      {!added && (
                        <div className="flex gap-1">
                          {[1, 2, 3].map((lvl) => (
                            <button
                              key={lvl}
                              onClick={() => handleAddSkill(skill.id, lvl)}
                              className="flex-1 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                              disabled={userSkills.length >= 20}
                            >
                              + Lv{lvl}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
              
              {allSkills.length === 0 && (
                <p className="text-center text-gray-500 py-8">Tidak ada skill ditemukan</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
