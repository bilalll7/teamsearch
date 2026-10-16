export interface Skill {
  id: string;
  nama: string;
  kategori?: { nama: string };
}
export interface Requirement {
  id?: string;
  skillId: string;
  jenis: string;
  levelMinimum: number;
  skill?: Skill;
}
export interface Position {
  id: string;
  nama: string;
  jumlahSlot: number;
  deskripsi?: string;
  skillRequirements: Requirement[];
}
export interface Opportunity {
  id: string;
  judul: string;
  deskripsi: string;
  jenis: string;
  kategori: string;
  mode: string;
  tenggat: string | null;
  status: string;
  ownerId: string;
  owner: { id: string; profile: { namaTampilan: string; bio?: string } };
  positions: Position[];
}
export interface Profile {
  userId: string;
  namaTampilan: string;
  bio: string | null;
  programStudi: string | null;
  angkatan: string | null;
  headline?: string | null;
  lokasi?: string | null;
  avatarUrl?: string | null;
  resumeUrl?: string | null;
  pengalaman?: ProfileExperience[];
  pendidikan?: ProfileEducation[];
  ketersediaan: boolean;
  userSkills: { id: string; skillId: string; level: number; skill: Skill }[];
  portfolioLinks: { id: string; label: string; url: string; tipe: string }[];
}
export interface ProfileExperience { id?: string; role: string; company: string; mulai?: string; selesai?: string; deskripsi?: string; }
export interface ProfileEducation { id?: string; institusi: string; program: string; mulai?: string; selesai?: string; deskripsi?: string; }
export interface Application {
  id: string;
  status: string;
  pesan?: string;
  createdAt: string;
  skorKecocokkanSaatLamar: number | null;
  position: {
    id: string;
    nama: string;
    opportunity: { id: string; judul: string; status: string };
  };
  applicant?: {
    id: string;
    profile: Profile;
  };
}
export interface Team {
  id: string;
  judul: string;
  status: string;
  ownerId: string;
  owner: { profile: { namaTampilan: string } };
  positions: Position[];
  teamMembers: {
    id: string;
    userId: string;
    peran: string;
    status: string;
    namaTampilan: string;
  }[];
}
