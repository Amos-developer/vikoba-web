<script setup>
import { storeToRefs } from "pinia";
import { computed, onMounted, ref } from "vue";
import DashboardLayout from "../../layouts/DashboardLayout.vue";
import {
  createMember,
  deleteMember,
  getMembers,
  updateMember,
} from "../../services/member.service.js";
import { useAuthStore } from "../../stores/auth.store.js";

const authStore = useAuthStore();
const { isAdmin } = storeToRefs(authStore);

const search = ref("");
const loading = ref(false);
const members = ref([]);
const showModal = ref(false);
const showDeleteModal = ref(false);
const isSubmitting = ref(false);
const editingMemberId = ref(null);
const memberToDelete = ref(null);
const formError = ref("");
const form = ref({
  first_name: "",
  last_name: "",
  phone: "",
  email: "",
});

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

const resetForm = () => {
  form.value = {
    first_name: "",
    last_name: "",
    phone: "",
    email: "",
  };
  editingMemberId.value = null;
  formError.value = "";
};

const openCreateModal = () => {
  resetForm();
  showModal.value = true;
};

const openEditModal = (member) => {
  editingMemberId.value = member.id;
  form.value = {
    first_name: member.first_name || "",
    last_name: member.last_name || "",
    phone: member.phone || "",
    email: member.email || "",
  };
  formError.value = "";
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
  resetForm();
};

const loadMembers = async () => {
  loading.value = true;

  try {
    const response = await getMembers();
    members.value = response.data?.data || [];
  } catch (error) {
    console.error("Members fetch failed:", error);
    formError.value = "Unable to load members right now.";
  } finally {
    loading.value = false;
  }
};

const submitMember = async () => {
  if (!form.value.first_name || !form.value.last_name || !form.value.phone) {
    formError.value = "First name, last name, and phone are required.";
    return;
  }

  isSubmitting.value = true;
  formError.value = "";

  try {
    if (editingMemberId.value) {
      await updateMember(editingMemberId.value, form.value);
    } else {
      await createMember(form.value);
    }

    await loadMembers();
    closeModal();
  } catch (error) {
    formError.value =
      error.response?.data?.message || "Unable to save this member.";
  } finally {
    isSubmitting.value = false;
  }
};

const confirmDelete = async () => {
  if (!memberToDelete.value) return;

  isSubmitting.value = true;

  try {
    await deleteMember(memberToDelete.value.id);
    memberToDelete.value = null;
    showDeleteModal.value = false;
    await loadMembers();
  } catch (error) {
    formError.value =
      error.response?.data?.message || "Unable to delete this member.";
  } finally {
    isSubmitting.value = false;
  }
};

onMounted(loadMembers);
</script>

<template>
  <DashboardLayout
    page-title="Members"
    page-subtitle="Manage members and accounts"
  >
    <section class="page-header">
      <div class="page-header-copy">
        <p class="page-header-label">Members summary</p>
        <h2>Members</h2>
        <p class="page-header-text text-muted mb-0">
          View and manage all Vikoba members with quick actions and member
          details.
        </p>
      </div>

      <button
        v-if="isAdmin"
        class="btn btn-primary btn-lg shadow-sm"
        @click="openCreateModal"
      >
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
              <span class="badge bg-secondary align-self-start">
                {{ filteredMembers.length }} results
              </span>
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

            <div v-if="formError" class="alert alert-warning mb-3">
              {{ formError }}
            </div>

            <div class="table-responsive d-none d-md-block">
              <table class="table align-middle mb-0 table-hover">
                <thead class="table-light">
                  <tr>
                    <th>Member</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Joined</th>
                    <th v-if="isAdmin" class="text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-if="loading">
                    <td :colspan="isAdmin ? 5 : 4" class="text-center py-5">
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
                    <td :colspan="isAdmin ? 5 : 4" class="text-center py-5">
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
                    <td v-if="isAdmin" class="text-end">
                      <div class="action-group">
                        <button
                          class="btn btn-sm btn-outline-primary"
                          @click="openEditModal(member)"
                        >
                          Edit
                        </button>
                        <button
                          class="btn btn-sm btn-outline-danger"
                          @click="
                            memberToDelete = member;
                            showDeleteModal = true;
                          "
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div class="member-card-list d-md-none">
              <div v-if="loading" class="empty-state">Loading members...</div>
              <div v-else-if="!filteredMembers.length" class="empty-state">
                No members found.
              </div>
              <article
                v-else
                v-for="member in filteredMembers"
                :key="member.id"
                class="member-card"
              >
                <div class="member-card-header">
                  <div class="d-flex align-items-center gap-3">
                    <div class="avatar">{{ member.first_name.charAt(0) }}</div>
                    <div>
                      <h6 class="mb-1">
                        {{ member.first_name }} {{ member.last_name }}
                      </h6>
                      <p class="text-muted mb-0">Member ID: {{ member.id }}</p>
                    </div>
                  </div>
                </div>
                <div class="member-card-body">
                  <div>
                    <span class="text-muted">Email</span>
                    <div>{{ member.email || "—" }}</div>
                  </div>
                  <div>
                    <span class="text-muted">Phone</span>
                    <div>{{ member.phone }}</div>
                  </div>
                  <div>
                    <span class="text-muted">Joined</span>
                    <div>{{ formatDate(member.created_at) }}</div>
                  </div>
                </div>
                <div v-if="isAdmin" class="action-group action-group-stack">
                  <button
                    class="btn btn-sm btn-outline-primary"
                    @click="openEditModal(member)"
                  >
                    Edit
                  </button>
                  <button
                    class="btn btn-sm btn-outline-danger"
                    @click="
                      memberToDelete = member;
                      showDeleteModal = true;
                    "
                  >
                    Delete
                  </button>
                </div>
              </article>
            </div>
          </div>
        </div>
      </div>
    </section>

    <div v-if="showModal" class="modal-backdrop">
      <div class="modal-panel">
        <div class="modal-panel-header">
          <div>
            <p class="page-header-label mb-2">
              {{ editingMemberId ? "Edit member" : "New member" }}
            </p>
            <h5 class="mb-0">
              {{
                editingMemberId
                  ? "Update member profile"
                  : "Create a new member"
              }}
            </h5>
          </div>
          <button class="btn-close" @click="closeModal"></button>
        </div>

        <form class="mt-3" @submit.prevent="submitMember">
          <div class="row g-3">
            <div class="col-12 col-md-6">
              <label class="form-label">First name</label>
              <input v-model="form.first_name" class="form-control" required />
            </div>
            <div class="col-12 col-md-6">
              <label class="form-label">Last name</label>
              <input v-model="form.last_name" class="form-control" required />
            </div>
            <div class="col-12 col-md-6">
              <label class="form-label">Phone</label>
              <input v-model="form.phone" class="form-control" required />
            </div>
            <div class="col-12 col-md-6">
              <label class="form-label">Email</label>
              <input v-model="form.email" class="form-control" type="email" />
            </div>
          </div>

          <div class="modal-actions">
            <button
              type="button"
              class="btn btn-outline-secondary"
              @click="closeModal"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="btn btn-primary"
              :disabled="isSubmitting"
            >
              {{
                isSubmitting
                  ? "Saving..."
                  : editingMemberId
                    ? "Save changes"
                    : "Create member"
              }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <div v-if="showDeleteModal" class="modal-backdrop">
      <div class="modal-panel confirm-panel">
        <h5 class="mb-3">Delete this member?</h5>
        <p class="text-muted mb-4">
          This action will remove the selected member profile from the database.
        </p>
        <div class="modal-actions">
          <button
            class="btn btn-outline-secondary"
            @click="showDeleteModal = false"
          >
            Cancel
          </button>
          <button
            class="btn btn-danger"
            :disabled="isSubmitting"
            @click="confirmDelete"
          >
            {{ isSubmitting ? "Deleting..." : "Delete member" }}
          </button>
        </div>
      </div>
    </div>
  </DashboardLayout>
</template>

<style scoped>
.page-header {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1.25rem 0;
  border-bottom: 1px solid rgba(15, 23, 42, 0.08);
}

.page-header-copy {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.page-header-label {
  display: inline-flex;
  margin-bottom: 0.1rem;
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

.action-group {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 0.45rem;
}

.action-group-stack {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.member-card-list {
  display: grid;
  gap: 0.85rem;
}

.member-card {
  border: 1px solid rgba(15, 23, 42, 0.08);
  border-radius: 1rem;
  padding: 1rem;
  background: #f8fafc;
}

.member-card-header {
  margin-bottom: 0.75rem;
}

.member-card-body {
  display: grid;
  gap: 0.65rem;
  margin-bottom: 0.75rem;
}

.member-card-body div {
  background: #ffffff;
  border-radius: 0.8rem;
  padding: 0.65rem;
}

.member-card-body span {
  display: block;
  font-size: 0.72rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin-bottom: 0.2rem;
}

.modal-backdrop {
  position: fixed;
  inset: 0;
  z-index: 1100;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  background: rgba(15, 23, 42, 0.55);
}

.modal-panel {
  width: min(100%, 40rem);
  background: #ffffff;
  border-radius: 1.2rem;
  padding: 1.25rem;
  box-shadow: 0 20px 50px rgba(15, 23, 42, 0.2);
}

.confirm-panel {
  width: min(100%, 28rem);
}

.modal-panel-header {
  display: flex;
  justify-content: space-between;
  align-items: start;
  gap: 1rem;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  margin-top: 1.25rem;
}

.empty-state {
  padding: 1.25rem;
  text-align: center;
  color: #64748b;
  border: 1px dashed rgba(15, 23, 42, 0.15);
  border-radius: 1rem;
  background: #f8fafc;
}

.btn-close {
  filter: invert(0.35);
}

@media (min-width: 768px) {
  .page-header {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
}
</style>
