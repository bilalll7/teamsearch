import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoadingSpinner } from '../components/LoadingSpinner';
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
          <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
            <button
              onClick={() => navigate('/profile')}
              className="text-[15px] font-medium text-muted-foreground hover:text-foreground"
            >
              ← Kembali
            </button>
            <h1 className="text-xl font-bold tracking-tight">Kelola Keahlian</h1>
            <div className="w-20" aria-hidden="true" />
          </div>
        </div>

        <div className="mx-auto w-full max-w-6xl px-6 py-8">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* My Skills */}
            <div className="lg:col-span-1">
              <div className="rounded-xl border border-border bg-surface p-6">
                <h2 className="mb-4 text-lg font-bold">
                  Keahlian Saya ({userSkills.length}/20)
                </h2>
                
                {userSkills.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Belum ada keahlian</p>
                ) : (
                  <div className="space-y-3">
                    {userSkills.map((us) => (
                      <div
                        key={us.id}
                        className="rounded-lg border border-border bg-background p-3"
                      >
                        <div className="mb-2 flex items-start justify-between">
                          <div className="flex-1">
                            <p className="text-sm font-medium">{us.skill.nama}</p>
                            <p className="text-xs text-muted-foreground">{us.skill.kategori.nama}</p>
                          </div>
                          <button
                            onClick={() => handleRemoveSkill(us.id)}
                            className="text-sm text-destructive hover:opacity-80"
                          >
                            ✕
                          </button>
                        </div>
                        
                        <div className="flex gap-1">
                          {[1, 2, 3].map((lvl) => (
                            <button
                              key={lvl}
                              onClick={() => handleUpdateLevel(us.id, lvl)}
                              className={`flex-1 rounded py-1 text-xs ${
                                us.level === lvl
                                  ? 'bg-primary text-white'
                                  : 'bg-surface-elevated text-muted-foreground hover:text-foreground'
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
              <div className="rounded-xl border border-border bg-surface p-6">
                <h2 className="mb-4 text-lg font-bold">Katalog Keahlian</h2>
                
                {/* Filters */}
                <div className="mb-4 space-y-3">
                  <div>
                    <label className="mb-1 block text-sm font-medium">
                      Kategori
                    </label>
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="h-12 w-full rounded-lg border border-border bg-background px-3.5 text-[15px] focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
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
                    <label className="mb-1 block text-sm font-medium">
                      Cari Skill
                    </label>
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Ketik nama skill..."
                      className="h-12 w-full rounded-lg border border-border bg-background px-3.5 text-[15px] placeholder:text-muted-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    />
                  </div>
                </div>

                {/* Skills Grid */}
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {allSkills.map((skill) => {
                    const added = isSkillAdded(skill.id);
                    return (
                      <div
                        key={skill.id}
                        className={`rounded-lg border p-3 ${
                          added
                            ? 'border-success/40 bg-success/10'
                            : 'border-border bg-background'
                        }`}
                      >
                        <div className="mb-2 flex items-start justify-between">
                          <div>
                            <p className="text-sm font-medium">{skill.nama}</p>
                            <p className="text-xs text-muted-foreground">{skill.kategori.nama}</p>
                          </div>
                          {added && (
                            <span className="text-xs font-medium text-success">✓ Added</span>
                          )}
                        </div>
                        
                        {!added && (
                          <div className="flex gap-1">
                            {[1, 2, 3].map((lvl) => (
                              <button
                                key={lvl}
                                onClick={() => handleAddSkill(skill.id, lvl)}
                                className="flex-1 rounded bg-primary/10 py-1 text-xs font-medium text-primary hover:bg-primary/20"
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
                  <p className="py-8 text-center text-muted-foreground">Tidak ada skill ditemukan</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
