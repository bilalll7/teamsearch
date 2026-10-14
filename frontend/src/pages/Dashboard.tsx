export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-gray-600">Selamat datang di TeamSearch!</p>
        
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Fitur dalam pengembangan:</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>Kelola profil dan skill Anda</li>
            <li>Buat dan kelola opportunity</li>
            <li>Cari kandidat dengan skill matching</li>
            <li>Kelola lamaran dan tim</li>
            <li>Notifikasi dan pertukaran kontak</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
