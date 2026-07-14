<script setup>
import { computed, onMounted, ref } from "vue";
import DashboardLayout from "../../layouts/DashboardLayout.vue";
import { getMembers } from "../../services/member.service.js";

const search = ref("");
const loading = ref(false);
const members = ref([]);

const stats = computed(() => {
  const totalMembers = members.value.length;
  const activeMembers = members.value.length;
  const now = new Date();

  const newThisMonth = members.value.filter((member) => {
    const createdAt = member.created_at ? new Date(member.created_at) : null;
    return (
      createdAt &&
      createdAt.getFullYear() === now.getFullYear() &&
      createdAt.getMonth() === now.getMonth()
    );
  }).length;

  return {
    totalMembers,
    activeMembers,
    newThisMonth,
  };
});

const filteredMembers = computed(() => {
  const query = search.value.trim().toLowerCase();

  if (!query) {
    return members.value;
  }

  return members.value.filter((member) => {
    return [
      `${member.first_name} ${member.last_name}`,
      member.email,
      member.phone,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase()
      .includes(query);
  });
});

const formatDate = (value) => {
  if (!value) return "N/A";

  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(value));
};

const loadMembers = async () => {
  loading.value = true;

  try {
    const response = await getMembers();
    members.value = response.data?.data || [];
  } catch (error) {
    console.error("Members fetch failed:", error);
  } finally {
    loading.value = false;
  }
};

onMounted(loadMembers);
</script>

<template>
  <DashboardLayout
    page-title="Members"
    page-subtitle="Manage members and accounts"
  >
    <section
      class="page-header d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3 mb-4"
    >
      <div>
        <p class="page-header-label">Members summary</p>
        <h2>Members</h2>
        <p class="page-header-text text-muted mb-0">
          View and manage all Vikoba members with quick actions and member
          details.
        </p>
      </div>

      <button class="btn btn-primary btn-lg shadow-sm">
        <i class="bi bi-person-plus-fill me-2"></i>
        Add Member
      </button>
    </section>

    <section class="row g-3 mb-4">
      <div class="col-12 col-sm-6 col-xl-4">
        <article class="info-card p-4">
          <small class="info-card-label">Total Members</small>
          <h3 class="info-card-value">{{ stats.totalMembers }}</h3>
          <p class="text-muted mb-0">Total registered members</p>
        </article>
      </div>

      <div class="col-12 col-sm-6 col-xl-4">
        <article class="info-card p-4">
          <small class="info-card-label">Loaded Members</small>
          <h3 class="info-card-value text-success">
            {{ stats.activeMembers }}
          </h3>
          <p class="text-muted mb-0">Members retrieved from the database</p>
        </article>
      </div>

      <div class="col-12 col-sm-6 col-xl-4">
        <article class="info-card p-4">
          <small class="info-card-label">New This Month</small>
          <h3 class="info-card-value text-primary">{{ stats.newThisMonth }}</h3>
          <p class="text-muted mb-0">Members added in the current month</p>
        </article>
      </div>
    </section>

    <section class="row g-3 mb-4">
      <div class="col-12 col-xl-5">
        <div class="card panel-card h-100 border-0 shadow-sm">
          <div class="card-body">
            <div
              class="d-flex justify-content-between align-items-start gap-3 mb-3"
            >
              <div>
                <h5 class="mb-1">Search members</h5>
                <p class="text-muted mb-0">Quickly filter member records.</p>
              </div>
              <span class="badge bg-secondary align-self-start"
                >{‌{ filteredMembers.length }} results</span
              >
            </div>

            <div
              class="input-group rounded-pill overflow-hidden border border-muted bg-white"
            >
              <span class="input-group-text bg-white border-0">
                <i class="bi bi-search"></i>
              </span>
              <input
                v-model="search"
                type="text"
                class="form-control border-0"
                placeholder="Search members..."
              />
            </div>
          </div>
        </div>
      </div>

      <div class="col-12 col-xl-7">
        <div class="card panel-card h-100 border-0 shadow-sm">
          <div class="card-body">
            <div
              class="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-3"
            >
              <h5 class="mb-0">Member list</h5>
              <span class="badge bg-primary">Updated today</span>
            </div>

            <div class="table-responsive">
              <table class="table align-middle mb-0 table-hover">
                <thead class="table-light">
                  <tr>
                    <th>Member</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Joined</th>
                    <th class="text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-if="loading">
                    <td colspan="5" class="text-center py-5">
                      <div
                        class="d-flex justify-content-center align-items-center gap-2"
                      >
                        <div class="spinner-border text-primary" role="status">
                          <span class="visually-hidden">Loading...</span>
                        </div>
                        <span>Loading members...</span>
                      </div>
                    </td>
                  </tr>
                  <tr v-else-if="!filteredMembers.length">
                    <td colspan="5" class="text-center py-5">
                      No members found.
                    </td>
                  </tr>
                  <tr v-else v-for="member in filteredMembers" :key="member.id">
                    <td>
                      <div class="d-flex align-items-center gap-3">
                        <div class="avatar">
                          {{ member.first_name.charAt(0) }}
                        </div>
                        <div>
                          <div class="fw-semibold">
                            {{ member.first_name }} {{ member.last_name }}
                          </div>
                          <small class="text-muted"
                            >Member ID: {{ member.id }}</small
                          >
                        </div>
                      </div>
                    </td>
                    <td>{{ member.email || "—" }}</td>
                    <td>{{ member.phone }}</td>
                    <td>{{ formatDate(member.created_at) }}</td>
                    <td class="text-end">
                      <button class="btn btn-sm btn-outline-primary me-2">
                        View
                      </button>
                      <button class="btn btn-sm btn-outline-secondary">
                        Edit
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </section>
  </DashboardLayout>
</template>

<style scoped>
.page-header {
  padding: 1.25rem 0;
  border-bottom: 1px solid rgba(15, 23, 42, 0.08);
}

.page-header-label {
  display: inline-flex;
  margin-bottom: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-size: 0.78rem;
  font-weight: 700;
  color: #0f766e;
}

.page-header-text {
  max-width: 38rem;
}

.info-card {
  border-radius: 1.5rem;
  background: #ffffff;
  box-shadow: 0 18px 44px rgba(15, 23, 42, 0.08);
}

.info-card-label {
  font-size: 0.85rem;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: #64748b;
}

.info-card-value {
  font-size: 2.1rem;
  font-weight: 800;
  margin: 0.8rem 0 0.45rem;
}

.panel-card {
  border-radius: 1.75rem;
}

.avatar {
  width: 45px;
  height: 45px;
  border-radius: 50%;
  background: #0d6efd;
  color: #fff;
  font-weight: 700;
  display: inline-grid;
  place-items: center;
}

.table tbody tr:hover {
  background: #f8fafc;
}

@media (max-width: 767px) {
  .page-header {
    padding-bottom: 0.75rem;
  }

  .page-header-text {
    max-width: 100%;
  }
}
</style>
