import { test, expect } from "@playwright/test";
import type { Page } from "@playwright/test";

async function setup(page: Page, owner = false) {
  const userId = owner ? "owner" : "candidate";
  const profile = {
    userId,
    namaTampilan: "Nadia Putri",
    bio: "Senang membangun produk digital.",
    programStudi: "Informatika",
    angkatan: "2024",
    ketersediaan: true,
    userSkills: [
      {
        id: "us",
        skillId: "react",
        level: 2,
        skill: { id: "react", nama: "React", kategori: { nama: "Frontend" } },
      },
    ],
    portfolioLinks: [],
  };
  const opportunity = {
    id: "opp",
    judul: "Platform belajar untuk semua",
    deskripsi:
      "Mari membangun pengalaman belajar yang lebih mudah bersama tim lintas keahlian.",
    jenis: "proyek",
    kategori: "Pendidikan",
    mode: "online",
    status: "open",
    tenggat: null,
    ownerId: "owner",
    owner: { id: "owner", profile: { namaTampilan: "Raka Pratama" } },
    positions: [
      {
        id: "pos",
        nama: "Frontend Developer",
        jumlahSlot: 2,
        deskripsi: "Bangun antarmuka yang mudah digunakan.",
        skillRequirements: [
          {
            id: "req",
            skillId: "react",
            jenis: "must_have",
            levelMinimum: 2,
            skill: { id: "react", nama: "React" },
          },
        ],
      },
    ],
  };
  let applied = false;
  let appStatus = "pending";
  await page.addInitScript(() => {
    localStorage.setItem("accessToken", "test-access");
    localStorage.setItem("refreshToken", "test-refresh");
    localStorage.setItem("theme", "light");
  });
  await page.route("http://localhost:3000/**", async (route) => {
    const request = route.request(),
      url = new URL(request.url()),
      path = url.pathname,
      method = request.method();
    let result: unknown = {};
    if (path === "/profile/me") result = profile;
    else if (path === "/skills")
      result = [
        { id: "react", nama: "React" },
        { id: "figma", nama: "Figma" },
      ];
    else if (path === "/opportunities/teams/me")
      result =
        owner || appStatus === "accepted"
          ? [
              {
                ...opportunity,
                teamMembers:
                  appStatus === "accepted"
                    ? [
                        {
                          id: "m",
                          userId: "candidate",
                          peran: "Frontend Developer",
                          status: "aktif",
                          namaTampilan: "Nadia Putri",
                        },
                      ]
                    : [],
              },
            ]
          : [];
    else if (path === "/opportunities/applications/me")
      result = applied
        ? [
            {
              id: "app",
              status: appStatus,
              createdAt: "2026-10-16",
              pesan: "Saya tertarik",
              position: {
                id: "pos",
                nama: "Frontend Developer",
                opportunity: {
                  id: "opp",
                  judul: opportunity.judul,
                  status: "open",
                },
              },
              skorKecocokkanSaatLamar: 100,
            },
          ]
        : [];
    else if (path === "/opportunities/positions/pos/applications") {
      if (method === "POST") {
        applied = true;
        result = { id: "app", status: "pending", positionId: "pos" };
      } else
        result = [
          {
            id: "app",
            status: appStatus,
            pesan: "Saya ingin berkontribusi.",
            skorKecocokkanSaatLamar: 100,
            applicant: { id: "candidate", profile },
          },
        ];
    } else if (path === "/opportunities/applications/app") {
      appStatus = request.postDataJSON().status;
      result = { id: "app", status: appStatus };
    } else if (path === "/opportunities")
      result =
        method === "POST"
          ? { ...opportunity, ...request.postDataJSON() }
          : [
              opportunity,
              {
                ...opportunity,
                id: "opp2",
                judul: "Kompetisi desain produk",
                jenis: "lomba",
              },
            ];
    else if (path === "/opportunities/opp/positions" && method === "POST") {
      const body = request.postDataJSON();
      const position = {
        ...body,
        id: "pos",
        skillRequirements: body.requirements.map((r: { skillId: string }) => ({
          ...r,
          id: "req",
          skill: { id: r.skillId, nama: "React" },
        })),
      };
      opportunity.positions.push(position);
      result = position;
    } else if (path === "/opportunities/opp") result = opportunity;
    await route.fulfill({ json: result });
  });
  return { opportunity };
}

test("owner can complete a legacy opportunity without positions", async ({
  page,
}) => {
  const { opportunity } = await setup(page, true);
  opportunity.positions = [];
  await page.goto("/opportunities/opp/manage");
  await page.getByLabel("Nama posisi baru").fill("Developer baru");
  await page.getByLabel("Tambahkan keahlian posisi baru").selectOption("react");
  await page.getByRole("button", { name: "Simpan posisi" }).click();
  await expect(
    page.getByRole("heading", { name: "Developer baru" }),
  ).toBeVisible();
});

test("dashboard and discovery render without browser errors", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await setup(page);
  await page.goto("/dashboard");
  await expect(
    page.getByRole("heading", { name: "Halo, Nadia Putri 👋" }),
  ).toBeVisible();
  await page.screenshot({
    path: "test-results/dashboard-desktop.png",
    fullPage: true,
  });
  await page.goto("/opportunities");
  await page
    .getByRole("textbox", { name: "Cari peluang atau keahlian" })
    .fill("tidak ditemukan");
  await expect(
    page.getByRole("heading", { name: "Belum menemukan yang cocok?" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Reset pencarian" }).click();
  await expect(
    page.getByRole("heading", { name: "Platform belajar untuk semua" }),
  ).toBeVisible();
  expect(errors).toEqual([]);
});
test("candidate applies, sees status and withdraws", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await setup(page);
  await page.goto("/opportunities/opp");
  await page.getByLabel("Perkenalkan dirimu (opsional)").fill("Saya tertarik");
  await page.getByRole("button", { name: "Kirim lamaran" }).click();
  await expect(
    page.getByRole("link", { name: "Pantau lamaran" }),
  ).toBeVisible();
  await page.getByRole("link", { name: "Pantau lamaran" }).click();
  await page
    .getByRole("button", { name: "Tarik lamaran", exact: true })
    .click();
  await page.getByRole("button", { name: "Ya, tarik" }).click();
  await expect(page.locator(".status-withdrawn")).toBeVisible();
  expect(errors).toEqual([]);
});
test("owner creates a complete opportunity in three steps", async ({
  page,
}) => {
  await setup(page, true);
  await page.goto("/opportunities/create");
  await page.getByLabel("Nama peluang *").fill("Aplikasi kolaborasi kampus");
  await page
    .getByLabel("Ceritakan idemu *")
    .fill("Membangun aplikasi untuk kolaborasi lintas jurusan.");
  await page.getByLabel("Kategori *").fill("Teknologi");
  await page.getByRole("button", { name: "Lanjutkan" }).click();
  await page.getByLabel("Nama posisi *").fill("Frontend developer");
  await page.getByRole("button", { name: /Tambah keahlian/ }).click();
  await page.getByLabel("Keahlian 1 posisi 1").selectOption("react");
  await page.getByRole("button", { name: "Lanjutkan" }).click();
  const requestPromise = page.waitForRequest(
    (r) =>
      r.url() === "http://localhost:3000/opportunities" &&
      r.method() === "POST",
  );
  await page.getByRole("button", { name: "Terbitkan peluang" }).click();
  const request = await requestPromise;
  expect(request.postDataJSON().positions[0].requirements[0].skillId).toBe(
    "react",
  );
  await expect(page).toHaveURL(/\/opportunities\/opp\/manage/);
});
test("owner accepts an applicant and sees team membership", async ({
  page,
}) => {
  await setup(page, true);
  await page.goto("/opportunities/opp/manage");
  await page.getByRole("button", { name: "Terima", exact: true }).click();
  await page.getByRole("button", { name: "Konfirmasi" }).click();
  await expect(page.locator(".status-accepted")).toBeVisible();
  await page.goto("/teams");
  await expect(
    page.locator(".member-row").filter({ hasText: "Nadia Putri" }),
  ).toBeVisible();
});
test("mobile navigation and pages fit the viewport", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await setup(page);
  for (const path of [
    "/dashboard",
    "/opportunities",
    "/opportunities/opp",
    "/opportunities/create",
    "/applications",
    "/teams",
    "/profile",
    "/profile/skills",
    "/profile/portfolio",
  ]) {
    await page.goto(path);
    await expect(page.locator(".skeleton-grid")).toHaveCount(0);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
      path,
    ).toBe(true);
  }
  await expect(
    page.getByRole("button", { name: "Keluar akun", exact: true }).first(),
  ).toBeVisible();
  await page.goto("/dashboard");
  await page.screenshot({
    path: "test-results/dashboard-mobile.png",
    fullPage: true,
  });
});
test("API failure has actionable feedback", async ({ page }) => {
  await setup(page);
  await page.route("http://localhost:3000/opportunities?status=open", (route) =>
    route.fulfill({
      status: 503,
      json: { message: "Layanan sementara tidak tersedia" },
    }),
  );
  await page.goto("/opportunities");
  await expect(page.getByRole("alert")).toContainText("Layanan sementara");
  await expect(page.getByRole("button", { name: "Coba lagi" })).toBeVisible();
});
